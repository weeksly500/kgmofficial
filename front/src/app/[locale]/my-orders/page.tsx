'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { API_ENDPOINTS } from '@/utils/apiConfig';
import enTranslations from '@/messages/en.json';
import frTranslations from '@/messages/fr.json';
import { Loader2, Package, AlertCircle, Search } from 'lucide-react';

type Order = {
  id: number;
  email: string | null;
  phone: string | null;
  status: string;
  vehicle_model: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type OrdersResponse = {
  success: boolean;
  orders: Order[];
};

const statusLabels: Record<string, { en: string; fr: string }> = {
  pending: { en: 'Pending', fr: 'En attente' },
  confirmed: { en: 'Confirmed', fr: 'Confirmée' },
  in_progress: { en: 'In progress', fr: 'En cours' },
  delivered: { en: 'Delivered', fr: 'Livrée' },
  cancelled: { en: 'Cancelled', fr: 'Annulée' },
};

const MyOrders = () => {
  const { language } = useLanguage();
  const t = language === 'fr' ? frTranslations : enTranslations;
  const nav = (t as { navigation?: { myOrders?: string } })?.navigation;
  const myOrdersTitle = nav?.myOrders ?? (language === 'fr' ? 'MES COMMANDES' : 'MY ORDERS');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterEmail, setFilterEmail] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [appliedEmail, setAppliedEmail] = useState('');
  const [appliedPhone, setAppliedPhone] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (appliedEmail.trim()) params.set('email', appliedEmail.trim());
        if (appliedPhone.trim()) params.set('phone', appliedPhone.trim());
        const url = params.toString() ? `${API_ENDPOINTS.ORDERS}?${params}` : API_ENDPOINTS.ORDERS;
        const res = await fetch(url);
        const data: OrdersResponse = await res.json();
        if (!res.ok) {
          throw new Error(data && typeof data === 'object' && 'message' in data ? (data as { message?: string }).message : 'Failed to load orders');
        }
        if (!cancelled && data.orders) {
          setOrders(data.orders);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load orders');
          setOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOrders();
    return () => { cancelled = true; };
  }, [appliedEmail, appliedPhone]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedEmail(filterEmail);
    setAppliedPhone(filterPhone);
  };

  const clearFilter = () => {
    setFilterEmail('');
    setFilterPhone('');
    setAppliedEmail('');
    setAppliedPhone('');
  };

  const getStatusLabel = (status: string) => {
    const labels = statusLabels[status] ?? { en: status, fr: status };
    return language === 'fr' ? labels.fr : labels.en;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return language === 'fr'
        ? d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        : d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/hero/202510301620.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {myOrdersTitle}
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {language === 'fr'
                  ? "Consultez et suivez l'état de vos commandes."
                  : 'View and track the status of your orders.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter by email / phone */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleFilter}
              className="mb-8 bg-white rounded-xl shadow-md p-4 sm:p-6"
            >
              <p className="text-sm font-medium text-gray-700 mb-3">
                {language === 'fr'
                  ? "Filtrer par email ou téléphone"
                  : "Filter by email or phone"}
              </p>
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[140px]">
                  <label htmlFor="filter-email" className="sr-only">
                    {language === 'fr' ? 'Email' : 'Email'}
                  </label>
                  <input
                    id="filter-email"
                    type="email"
                    placeholder={language === 'fr' ? 'votre@email.com' : 'your@email.com'}
                    value={filterEmail}
                    onChange={(e) => setFilterEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label htmlFor="filter-phone" className="sr-only">
                    {language === 'fr' ? 'Téléphone' : 'Phone'}
                  </label>
                  <input
                    id="filter-phone"
                    type="tel"
                    placeholder={language === 'fr' ? 'Numéro de téléphone' : 'Phone number'}
                    value={filterPhone}
                    onChange={(e) => setFilterPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  {language === 'fr' ? 'Rechercher' : 'Search'}
                </button>
                {(appliedEmail || appliedPhone) && (
                  <button
                    type="button"
                    onClick={clearFilter}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    {language === 'fr' ? 'Tout afficher' : 'Show all'}
                  </button>
                )}
              </div>
            </motion.form>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg"
              >
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
                <p className="text-gray-600">
                  {language === 'fr' ? 'Chargement de vos commandes...' : 'Loading your orders...'}
                </p>
              </motion.div>
            )}

            {!loading && error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800"
              >
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p>
                  {language === 'fr'
                    ? "Impossible de charger les commandes. Veuillez réessayer plus tard."
                    : "Couldn't load orders. Please try again later."}
                </p>
              </motion.div>
            )}

            {!loading && !error && orders.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  {language === 'fr'
                    ? "Vous n'avez pas encore de commandes ou cette fonctionnalité sera bientôt disponible."
                    : "You don't have any orders yet, or this feature will be available soon."}
                </p>
              </motion.div>
            )}

            {!loading && !error && orders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {language === 'fr' ? 'Commande' : 'Order'} #{order.id}
                        </p>
                        <p className="text-gray-600 mt-1">
                          {formatDate(order.created_at)}
                        </p>
                        {order.vehicle_model && (
                          <p className="text-gray-700 font-medium mt-2">
                            {order.vehicle_model}
                          </p>
                        )}
                        {order.notes && (
                          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                            {order.notes}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : order.status === 'in_progress' || order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    {(order.email || order.phone) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                        {order.email && <span>{order.email}</span>}
                        {order.email && order.phone && ' · '}
                        {order.phone && <span>{order.phone}</span>}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </Layout>
  );
};

export default MyOrders;
