import { DateTime } from "luxon";
import Link from "next/link";
import { useState } from "react";
import { usePrice } from "~/hooks/usePrice";
import { type IOrderList } from "~/server/api/routers/orderRouter";

type Props = {
  orders: IOrderList;
};
export function OrderList({ orders }: Props) {
  const [show, setShow] = useState<number | null>(null);

  return (
    <div>
      <div className="w-full sm:px-6">
        <div className="px-4 py-4 md:px-10 md:py-7">
          <div className="flex items-center justify-between">
            <p className="text-base font-bold leading-normal text-gray-800 sm:text-lg md:text-xl lg:text-2xl">
              Orders
            </p>
            <div className="flex cursor-pointer items-center rounded bg-gray-200 py-3 px-4 text-sm font-medium leading-none text-gray-600 hover:bg-gray-300">
              <p>Sort By:</p>
              <select className="ml-1 bg-transparent focus:outline-none">
                <option className="text-sm text-indigo-800">Latest</option>
                <option className="text-sm text-indigo-800">Oldest</option>
                <option className="text-sm text-indigo-800">Latest</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-white py-4 px-4 md:py-7 md:px-8 xl:px-10">
          <div className="items-center justify-between sm:flex">
            <div className="flex items-center">
              <button>
                <div className="rounded-full bg-indigo-100 py-2 px-8 text-indigo-700">
                  <p>All</p>
                </div>
              </button>
              <button>
                <div className="ml-4 rounded-full py-2 px-8 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 sm:ml-8">
                  <p>Done</p>
                </div>
              </button>
              <button>
                <div className="ml-4 rounded-full py-2 px-8 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 sm:ml-8">
                  <p>Pending</p>
                </div>
              </button>
            </div>
          </div>
          <div className="mt-7 overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <tr className="flex h-16 items-center justify-around rounded">
                <th className="border border-gray-400">
                  <div className="flex items-center pl-5">
                    <p className="mr-2 text-base font-medium leading-none text-gray-700">
                      Order Id
                    </p>
                  </div>
                </th>
                <th className="pl-24">
                  <div className="flex items-center">
                    <p className="ml-2 text-sm leading-none text-gray-600">
                      Total
                    </p>
                  </div>
                </th>
                <th className="pl-5">
                  <div className="flex items-center">
                    <p className="ml-2 text-sm leading-none text-gray-600">
                      Date
                    </p>
                  </div>
                </th>
                <th className="pl-4">
                  <button className="rounded py-3 px-5 text-sm leading-none text-gray-600">
                    Action
                  </button>
                </th>
              </tr>
              <tbody className="flex flex-col gap-2">
                {orders.map((order) => (
                  <OrderLine order={order} key={order.id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>
        {` .checkbox:checked + .check-icon {
                display: flex;
            }`}
      </style>
    </div>
  );
}

type OrderLineProps = {
  order: IOrderList[0];
};

function OrderLine({ order }: OrderLineProps): JSX.Element {
  const { formattedPrice } = usePrice(order.total);
  return (
    <tr className="flex h-16 items-center justify-around rounded bg-gray-100">
      <td className="">
        <div className="flex items-center pl-5">
          <p className="mr-2 text-base font-medium leading-none text-gray-700">
            #{order.id}
          </p>
        </div>
      </td>
      <td className="pl-24">
        <div className="flex items-center">
          <p className="ml-2 text-sm leading-none text-gray-600">
            {formattedPrice}
          </p>
        </div>
      </td>
      <td className="pl-5">
        <div className="flex items-center">
          <p className="ml-2 text-sm leading-none text-gray-600">
            {DateTime.fromJSDate(order.orderDate).toFormat("dd MMM yyyy")}
          </p>
        </div>
      </td>
      <td className="pl-4">
        <Link
          href={`/orders/${order.id}`}
          className="rounded bg-gray-100 py-3 px-5 text-sm leading-none text-gray-600 hover:bg-gray-200 focus:outline-none"
        >
          View
        </Link>
      </td>
    </tr>
  );
}
