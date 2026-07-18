from sqlalchemy import select
from sqlalchemy.orm import Session

from app.entities.fraud_cluster import FraudCluster
from app.entities.fraud_edge import FraudEdge
from app.entities.fraud_node import FraudNode


class FraudRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_node(self, node_id: str) -> FraudNode | None:
        stmt = select(FraudNode).where(FraudNode.id == node_id)
        return self.db.execute(stmt).scalar_one_or_none()

    def get_all_nodes(self) -> list[FraudNode]:
        return list(self.db.execute(select(FraudNode)).scalars().all())

    def get_all_edges(self) -> list[FraudEdge]:
        return list(self.db.execute(select(FraudEdge)).scalars().all())

    def get_all_clusters(self) -> list[FraudCluster]:
        return list(self.db.execute(select(FraudCluster)).scalars().all())
