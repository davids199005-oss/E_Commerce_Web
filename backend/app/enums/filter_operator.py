from enum import Enum

# Filter Operator
class FilterOperator(str, Enum):
    EQ = "eq"
    GT = "gt"
    LT = "lt"
