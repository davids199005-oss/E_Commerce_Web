from app.enums.filter_operator import FilterOperator

OPERATOR_SQL: dict[FilterOperator, str] = {
    FilterOperator.LT: "<",
    FilterOperator.GT: ">",
    FilterOperator.EQ: "=",
}
