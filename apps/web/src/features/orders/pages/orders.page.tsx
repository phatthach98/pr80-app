import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { useNavigate } from '@tanstack/react-router';

export function OrdersPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
      {Array.from({ length: 10 }).map((_, index) => (
        <Card
          key={index}
          className="w-full md:w-[calc(50%-1rem)]"
          onClick={() => {
            navigate({
              to: '/orders/$orderId',
              params: {
                orderId: index.toString(),
              },
            });
          }}
        >
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
