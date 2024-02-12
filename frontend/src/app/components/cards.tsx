

export default async function CardWrapper() {
  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course */}

      <Card title="Collected" value={1} type="collected" />
      <Card title="Pending" value={2} type="pending" />
      <Card title="Total Invoices" value={3} type="invoices" />
      <Card
        title="Total Customers"
        value={1}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">

        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
