from enum import Enum

class OrderStatus(str, Enum):
  TEMP = "TEMP"
  CLOSED = "CLOSED"
