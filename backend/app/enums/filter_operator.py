from enum import Enum


class FilterOperator(str, Enum):
    EQ = "eq"
    GT = "gt"
    LT = "lt"
