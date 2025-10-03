import { useStore } from '@tanstack/react-store';
import { socketStore } from '@/store/socket.store';
import { cn } from '@/tailwind/utils';

type SocketStatusProps = {
  className?: string;
};

export const SocketStatus = ({ className }: SocketStatusProps) => {
  const { connectionStatus } = useStore(socketStore);

  return (
    <div className={cn('flex flex-col items-center justify-between', className)}>
      {connectionStatus === 'connected' && (
        <div className="text-base text-green-700">● Cập nhật liên tục</div>
      )}

      {connectionStatus === 'disconnected' && (
        <div className="text-base text-red-500">● Mất kết nối...</div>
      )}

      {connectionStatus === 'connecting' && (
        <div className="text-base text-yellow-500">● Đang kết nối...</div>
      )}
    </div>
  );
};
