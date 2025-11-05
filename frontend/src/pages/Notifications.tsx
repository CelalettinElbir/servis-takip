import React, { useEffect, useState } from 'react';
import API from '../api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}
interface ServisKayit {
  id: number;
  musteri_adi: string;
  ariza: string;
}

interface Notification {
  id: number;
  user: User;
  service_record: ServisKayit;
  message: string;
  created_at: string;
  is_read: boolean;
  overdue_days: number;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await API.get('auth/notifications/');
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Bildirimler yüklenirken hata:', err);
      setError('Bildirimler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await API.patch(`auth/notifications/${id}/`, { is_read: true });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Bildirim okundu işaretlenirken hata:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔔 Bildirimler</h1>
        <button
          onClick={fetchNotifications}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Yenile
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-gray-500 text-center">Henüz bildirim bulunmuyor.</div>
      ) : (
        <div className="space-y-4">

          {notifications.results.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-sm border transition ${
                notification.is_read
                  ? 'bg-white border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="font-medium text-gray-800">{notification.message}</p>

                  <div className="text-sm text-gray-600">
                    {notification.service_record && (
                      <p>
                        <span className="font-semibold">Servis Kaydı:</span>{' '}
                        {notification.service_record.musteri_adi} —{' '}
                        {notification.service_record.ariza}
                      </p>
                    )}

                    {notification.overdue_days > 0 && (
                      <p className="text-red-500 font-medium">
                        ⚠️ Gecikme: {notification.overdue_days} gün
                      </p>
                    )}

                    <p className="text-gray-500">
                      {new Date(notification.created_at).toLocaleString('tr-TR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                  >
                    Okundu İşaretle
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
