"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getThrownErrorMessage } from "@/lib/api/errorMessage";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useGetItemsQuery,
  useUpdateItemMutation,
} from "@/lib/features/items/itemsApi";
import { formatMoney } from "@/lib/money/formatMoney";
import type { Item } from "@/lib/types/api";

interface ItemFormState {
  name: string;
  price_usd: string;
  stock_qty: string;
  image_url: string;
}

const emptyForm: ItemFormState = {
  name: "",
  price_usd: "",
  stock_qty: "0",
  image_url: "",
};

function formFromItem(item: Item): ItemFormState {
  return {
    name: item.name,
    price_usd: String(item.price_usd),
    stock_qty: String(item.stock_qty),
    image_url: item.image_url ?? "",
  };
}

export default function AdminItemsPage() {
  const { data, isLoading } = useGetItemsQuery();
  const [createItem, createState] = useCreateItemMutation();
  const [updateItem, updateState] = useUpdateItemMutation();
  const [deleteItem, deleteState] = useDeleteItemMutation();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ItemFormState>(emptyForm);
  const items = data?.items ?? [];

  function openCreate(): void {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(item: Item): void {
    setEditingId(item.id);
    setForm(formFromItem(item));
    setOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const price = Number(form.price_usd);
    const stock = Number(form.stock_qty);
    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(stock) || stock < 0) {
      toast.error("Проверьте цену и остаток");
      return;
    }
    const imageUrl = form.image_url.trim() ? form.image_url.trim() : null;
    try {
      if (editingId === null) {
        await createItem({
          name: form.name.trim(),
          price_usd: price,
          stock_qty: stock,
          image_url: imageUrl,
        }).unwrap();
        toast.success("Товар создан");
      } else {
        await updateItem({
          itemId: editingId,
          body: {
            name: form.name.trim(),
            price_usd: price,
            stock_qty: stock,
            image_url: imageUrl,
          },
        }).unwrap();
        toast.success("Товар обновлён");
      }
      setOpen(false);
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  async function handleDelete(itemId: number): Promise<void> {
    try {
      await deleteItem(itemId).unwrap();
      toast.success("Товар удалён");
    } catch (caught: unknown) {
      toast.error(getThrownErrorMessage(caught));
    }
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Товары
        </h1>
        <Button size="xl" onClick={openCreate}>
          Добавить
        </Button>
      </div>
      <div className="rounded-xl bg-card shadow-sm ring-1 ring-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Остаток</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>Загрузка...</TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatMoney(item.price_usd)}</TableCell>
                  <TableCell>{item.stock_qty}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" onClick={() => openEdit(item)}>
                      Изменить
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={deleteState.isLoading}
                      onClick={() => {
                        void handleDelete(item.id);
                      }}
                    >
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <form
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
            className="grid gap-4"
          >
            <DialogHeader>
              <DialogTitle>
                {editingId === null ? "Новый товар" : "Редактирование"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="item-name">Название</Label>
              <Input
                id="item-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                className="h-11 text-sm md:text-sm"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-price">Цена, USD</Label>
              <Input
                id="item-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price_usd}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price_usd: event.target.value,
                  }))
                }
                className="h-11 text-sm md:text-sm"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-stock">Остаток</Label>
              <Input
                id="item-stock"
                type="number"
                min="0"
                step="1"
                value={form.stock_qty}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    stock_qty: event.target.value,
                  }))
                }
                className="h-11 text-sm md:text-sm"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-image">URL картинки</Label>
              <Input
                id="item-image"
                value={form.image_url}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    image_url: event.target.value,
                  }))
                }
                placeholder="/pics/example.jpg"
                className="h-11 text-sm md:text-sm"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button
                type="submit"
                size="xl"
                disabled={createState.isLoading || updateState.isLoading}
              >
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
