"""empty message

Revision ID: 2e99ff27687c
Revises: 5cddeed6a17b
Create Date: 2025-06-29 18:16:11.810810

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2e99ff27687c'
down_revision = '5cddeed6a17b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bakatsiswa', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('bakatsiswa', schema=None) as batch_op:
        batch_op.drop_column('created_at')

    # ### end Alembic commands ###
