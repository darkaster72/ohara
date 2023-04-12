import Layout from "~/layouts/Main";
import { api } from "~/utils/api";
import { OrderList } from "../../components/order/OrderList";

function Index() {
  const { data: orders, isLoading } = api.order.getAll.useQuery();

  return (
    <Layout>
      {isLoading && <p>Loading</p>}
      {!!orders?.length && <OrderList orders={orders} />}
      {!isLoading && !orders?.length && <p>No order found</p>}
    </Layout>
  );
}

export default Index;
