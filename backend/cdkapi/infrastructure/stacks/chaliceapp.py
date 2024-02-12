import os

from aws_cdk import aws_dynamodb as dynamodb

try:
    from aws_cdk import core as cdk
except ImportError:
    import aws_cdk as cdk

from chalice.cdk import Chalice


RUNTIME_SOURCE_DIR = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), os.pardir, 'runtime')


class ChaliceApp(cdk.Stack):

    def __init__(self, scope, id, **kwargs):
        super().__init__(scope, id, **kwargs)
        self.dynamodb_table = self._create_ddb_table('AppTable','AppTableName')
        # Create a table for Order
        self.dynamodb_table_order = self._create_ddb_table('OrderTable','OrderTableName')
        self.dynamodb_table_menu = self._create_ddb_table('MenuPriceAll','MenuTableName')

        self.chalice = Chalice(
            self, 'ChaliceApp', source_dir=RUNTIME_SOURCE_DIR,
            stage_config={
                'environment_variables': {
                    'APP_TABLE_NAME': self.dynamodb_table.table_name,
                    'ORDER_TABLE_NAME': self.dynamodb_table_order.table_name,
                    'MENU_TABLE_NAME': self.dynamodb_table_menu.table_name
                }
            }
        )
        self.dynamodb_table.grant_read_write_data(
            self.chalice.get_role('DefaultRole')
        )
        # Grant permission for Order table
        self.dynamodb_table_order.grant_read_write_data(
            self.chalice.get_role('DefaultRole')
        )
        # Grant permission for Menu table
        self.dynamodb_table_menu.grant_read_write_data(
            self.chalice.get_role('DefaultRole')
        )

    def _create_ddb_table(self, tableId, tableName):
        dynamodb_table = dynamodb.Table(
            self, tableId,
            partition_key=dynamodb.Attribute(
                name='PK', type=dynamodb.AttributeType.STRING),
            sort_key=dynamodb.Attribute(
                name='SK', type=dynamodb.AttributeType.STRING
            ),
            removal_policy=cdk.RemovalPolicy.DESTROY)
        cdk.CfnOutput(self, tableName,
                      value=dynamodb_table.table_name)
        return dynamodb_table
