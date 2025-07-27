"""add signups table

Revision ID: 3ab8f77a4ad5
Revises: 9b352d883dab
Create Date: 2025-08-30 00:00:00
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "3ab8f77a4ad5"
down_revision: Union[str, Sequence[str], None] = "9b352d883dab"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "signups",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("first_name", sa.String(), nullable=False),
        sa.Column("last_name", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_signups_id"), "signups", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_signups_id"), table_name="signups")
    op.drop_table("signups")
