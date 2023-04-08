import { Prisma } from "@prisma/client";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { usePrice } from "~/hooks/usePrice";
import { ILineItem, IOrder } from "~/server/api/routers/orderRouter";
import { api } from "~/utils/api";

const OrderPage = () => {
  const id = useRouter().query.id as string;
  const {
    data: order,
    isLoading,
    error,
  } = api.order.getById.useQuery(+id, {
    enabled: !!id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!order) return <p>{error.message}</p>;

  return (
    <div className="py-14 px-4 2xl:container md:px-6 2xl:mx-auto 2xl:px-20">
      <div className="item-start flex flex-col justify-start space-y-2 ">
        <h1 className="text-3xl font-semibold leading-7 text-gray-800 lg:text-4xl  lg:leading-9">
          Order #{order.id}
        </h1>
        <p className="text-base font-medium leading-6 text-gray-600">
          {DateTime.fromJSDate(order.orderDate).toFormat(
            "dd MMM yyyy, HH:mm:ss a"
          )}
        </p>
      </div>
      <div className="jusitfy-center mt-10 flex w-full flex-col items-stretch  space-y-4 md:space-y-6 xl:flex-row xl:space-x-8 xl:space-y-0">
        <div className="flex w-full flex-col items-start justify-start space-y-4 md:space-y-6 xl:space-y-8">
          <div className="flex w-full flex-col items-start justify-start bg-gray-50 px-4 py-4 md:p-6 md:py-6 xl:p-8">
            <p className="text-lg font-semibold leading-6 text-gray-800 md:text-xl xl:leading-5">
              Cart
            </p>
            {order.lineItems.map((item) => (
              <OrderLineItem item={item} />
            ))}
          </div>
          <div className="flex w-full flex-col items-stretch justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-6 xl:space-x-8">
            <Summary order={order} />
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between bg-gray-50 px-4 py-6 md:items-start md:p-6 xl:w-96 xl:p-8 ">
          <h3 className="text-xl font-semibold leading-5 text-gray-800">
            Customer
          </h3>
          <div className="flex  h-full w-full flex-col items-stretch justify-start md:flex-row md:space-x-6 lg:space-x-8 xl:flex-col xl:space-x-0 ">
            <div className="flex flex-shrink-0 flex-col items-start justify-start">
              <div className="flex w-full  items-center  justify-center space-x-4 border-b border-gray-200 py-8 md:justify-start">
                <img
                  src={`https://ui-avatars.com/api/?background=random&name=${order.user.name}`}
                  alt="avatar"
                />
                <div className=" flex flex-col items-start justify-start space-y-2">
                  <p className="text-left text-base font-semibold leading-4 text-gray-800">
                    {order.user.name}
                  </p>
                </div>
              </div>

              <div className="flex w-full  items-center justify-center space-x-4 border-b border-gray-200 py-4 md:justify-start">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                    stroke="#1F2937"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 7L12 13L21 7"
                    stroke="#1F2937"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="cursor-pointer text-sm leading-5 text-gray-800">
                  {order.user.email}
                </p>
              </div>
            </div>
            <div className="mt-6 flex w-full  flex-col items-stretch justify-between md:mt-0 xl:h-full">
              <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:items-start md:justify-start md:space-x-6 md:space-y-0 lg:space-x-8 xl:flex-col  xl:space-x-0 xl:space-y-12 ">
                <div className="flex flex-col items-center  justify-center space-y-4 md:items-start md:justify-start xl:mt-8">
                  <p className="text-center text-base font-semibold leading-4 text-gray-800 md:text-left">
                    Shipping Address
                  </p>
                  <p className="w-48 text-center text-sm leading-5 text-gray-600 md:text-left lg:w-full xl:w-48">
                    {formatAddress(order.address)}
                  </p>
                </div>
                <div className="flex flex-col items-center  justify-center space-y-4 md:items-start md:justify-start ">
                  <p className="text-center text-base font-semibold leading-4 text-gray-800 md:text-left">
                    Billing Address
                  </p>
                  <p className="w-48 text-center text-sm leading-5 text-gray-600 md:text-left lg:w-full xl:w-48">
                    {formatAddress(order.address)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;

function Summary({ order }: { order: IOrder }) {
  const { formattedPrice: totalPrice } = usePrice(order.total);

  return (
    <div className="flex w-full flex-col space-y-6 bg-gray-50 px-4 py-6 md:p-6 xl:p-8   ">
      <h3 className="text-xl font-semibold leading-5 text-gray-800">Summary</h3>
      <div className="flex w-full flex-col items-center justify-center space-y-4 border-b border-gray-200 pb-4">
        <div className="flex w-full  justify-between">
          <p className="text-base leading-4 text-gray-800">Subtotal</p>
          <p className="text-base leading-4 text-gray-600">{totalPrice}</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <p className="text-base leading-4 text-gray-800">Shipping</p>
          <p className="text-base leading-4 text-gray-600">
            Will be shared in the email
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <p className="text-base font-semibold leading-4 text-gray-800">Total</p>
        <p className="text-base font-semibold leading-4 text-gray-600">
          {totalPrice}
        </p>
      </div>
    </div>
  );
}

function OrderLineItem({ item }: { item: ILineItem }): JSX.Element {
  const { formattedPrice, originalPrice } = usePrice(item);
  const { formattedPrice: totalPrice } = usePrice(
    new Prisma.Decimal(item.quantity * +item.currentPrice)
  );
  return (
    <div className="mt-4 flex w-full  flex-col items-start justify-start md:mt-6 md:flex-row md:items-center md:space-x-6 xl:space-x-8 ">
      <div className="w-full pb-4 md:w-40 md:pb-8">
        <img className="hidden w-full md:block" src="" alt="dress" />
        <img className="w-full md:hidden" src="" alt="dress" />
      </div>
      <div className="flex w-full flex-col items-start justify-between space-y-4 border-b border-gray-200  pb-8 md:flex-row md:space-y-0">
        <div className="flex w-full flex-col items-start justify-start space-y-8">
          <h3 className="text-xl font-semibold leading-6 text-gray-800 xl:text-2xl">
            {item.book.title}
          </h3>
          <div className="flex flex-col items-start justify-start space-y-1">
            <p className="text-sm leading-none text-gray-800">
              <span className="text-gray-500">Author: </span>{" "}
              {item.book.authors.map((auth) => auth.name)}
            </p>
          </div>
        </div>
        <div className="flex w-full items-start justify-between space-x-8">
          <p className="text-base leading-6 xl:text-lg">
            {formattedPrice}&nbsp;
            <span className="text-red-300 line-through"> {originalPrice}</span>
          </p>
          <p className="text-base leading-6 text-gray-800 xl:text-lg">
            {item.quantity}
          </p>
          <p className="text-base font-semibold leading-6 text-gray-800 xl:text-lg">
            {totalPrice}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatAddress(address: IOrder["address"]): string {
  return (
    address.address +
    " " +
    address.city +
    ", " +
    address.state +
    " " +
    address.postalCode
  );
}
