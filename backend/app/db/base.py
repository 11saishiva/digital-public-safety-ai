from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Root SQLAlchemy Declarative Base.

    All ORM entities inherit from this class
    through BaseEntity.
    """

    pass
