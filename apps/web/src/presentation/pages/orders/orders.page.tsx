import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui';

export function OrdersPage() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
      {Array.from({ length: 10 }).map((_, index) => (
        <Card key={index} className="w-full md:w-[calc(50%-1rem)]">
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
