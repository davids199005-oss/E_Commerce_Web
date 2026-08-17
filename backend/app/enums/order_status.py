from enum import Enum

# Order Status
class OrderStatus(str, Enum):
    TEMP = "TEMP"
    CLOSED = "CLOSED"
