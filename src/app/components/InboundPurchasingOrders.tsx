import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Search,
  Download,
  X,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  MapPin,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Package,
  Calendar
} from "lucide-react";

interface LineItem {
  sku: string;
  name: string;
  price: number;
  qty: number;
  total: number;
}

interface PurchaseOrder {
  id: string;
  dealer: string;
  dealerTaxId: string;
  dateSubmitted: string;
  deliveryDate: string;
  totalAmount: number;
  internalStatus: "Pending" | "Approved" | "Synced" | "Returned";
  syncStatus: "none" | "synced" | "error";
  items: LineItem[];
  syncTarget?: "MISA" | "BC";
}

const products = [
  { sku: "WIN-X90-01", name: "Aluminum Window X90 (Gray)", price: 1500000 },
  { sku: "DOOR-S55-02", name: "Sliding Door S55 (White)", price: 2200000 },
  { sku: "ACC-HND-01", name: "Handle Type A", price: 150000 },
  { sku: "ACC-LCK-02", name: "Safety Lock System", price: 350000 },
  { sku: "WIN-350-03", name: "YKK AP 350 Series Window", price: 3240000 },
  { sku: "CW-SYS-01", name: "Curtain Wall System", price: 12450000 }
];

const getRandomItems = (): LineItem[] => {
  const count = Math.floor(Math.random() * 4) + 1;
  const items: LineItem[] = [];
  for (let i = 0; i < count; i++) {
    const prod = products[Math.floor(Math.random() * products.length)];
    const qty = Math.floor(Math.random() * 10) + 1;
    items.push({
      ...prod,
      qty,
      total: prod.price * qty
    });
  }
  return items;
};

export function InboundPurchasingOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: "PO-2024-001",
      dealer: "An Phat Glass",
      dealerTaxId: "0301234567",
      dateSubmitted: "2025-01-10",
      deliveryDate: "2025-01-20",
      totalAmount: 0,
      internalStatus: "Pending",
      syncStatus: "none",
      items: getRandomItems()
    },
    {
      id: "PO-2024-002",
      dealer: "Saigon Windows",
      dealerTaxId: "0301234568",
      dateSubmitted: "2025-01-09",
      deliveryDate: "2025-01-19",
      totalAmount: 0,
      internalStatus: "Approved",
      syncStatus: "error",
      items: getRandomItems(),
      syncTarget: "MISA"
    },
    {
      id: "PO-2024-003",
      dealer: "Viet Nhat Construction",
      dealerTaxId: "0301234569",
      dateSubmitted: "2025-01-09",
      deliveryDate: "2025-01-19",
      totalAmount: 0,
      internalStatus: "Synced",
      syncStatus: "synced",
      items: getRandomItems(),
      syncTarget: "MISA"
    },
    {
      id: "PO-2024-004",
      dealer: "Hung Thinh Facade",
      dealerTaxId: "0301234570",
      dateSubmitted: "2025-01-08",
      deliveryDate: "2025-01-18",
      totalAmount: 0,
      internalStatus: "Pending",
      syncStatus: "none",
      items: getRandomItems()
    },
    {
      id: "PO-2024-005",
      dealer: "Nam Long Corp",
      dealerTaxId: "0301234571",
      dateSubmitted: "2025-01-08",
      deliveryDate: "2025-01-18",
      totalAmount: 0,
      internalStatus: "Synced",
      syncStatus: "synced",
      items: getRandomItems(),
      syncTarget: "MISA"
    },
    {
      id: "PO-2024-006",
      dealer: "Minh Quan Door",
      dealerTaxId: "0301234572",
      dateSubmitted: "2025-01-08",
      deliveryDate: "2025-01-18",
      totalAmount: 0,
      internalStatus: "Returned",
      syncStatus: "none",
      items: getRandomItems()
    }
  ]);

  // Calculate totals on mount
  useEffect(() => {
    const updatedOrders = orders.map(order => ({
      ...order,
      totalAmount: order.items.reduce((sum, item) => sum + item.total, 0)
    }));
    setOrders(updatedOrders);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "Approved":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready to Sync
          </Badge>
        );
      case "Synced":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "Returned":
        return (
          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            Returned
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSyncIcon = (syncStatus: string, internalStatus: string) => {
    if (internalStatus === "Returned") {
      return <span className="text-gray-300">-</span>;
    }

    switch (syncStatus) {
      case "synced":
        return (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-[10px] text-green-600 font-bold mt-0.5">MISA AMIS</span>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-[10px] text-red-600 font-bold mt-0.5">Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center">
            <Clock className="h-5 w-5 text-gray-300" />
            <span className="text-[10px] text-gray-400 font-bold mt-0.5">Waiting</span>
          </div>
        );
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "error"
        ? order.syncStatus === "error"
        : order.internalStatus.toLowerCase() === filterStatus.toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.dealer.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pendingCount = orders.filter(o => o.internalStatus === "Pending").length;
  const approvedCount = orders.filter(o => o.internalStatus === "Approved" && o.syncStatus !== "synced").length;
  const errorCount = orders.filter(o => o.syncStatus === "error").length;

  const handleViewOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setShowDrawer(true);
    setSyncLogs([]);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  const handleApprove = (orderId: string) => {
    setOrders(orders.map(o => (o.id === orderId ? { ...o, internalStatus: "Approved" } : o)));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, internalStatus: "Approved" });
    }
  };

  const handleReject = (orderId: string) => {
    setOrders(orders.map(o => (o.id === orderId ? { ...o, internalStatus: "Returned", syncStatus: "none" } : o)));
    handleCloseDrawer();
  };

  const handleSync = (orderId: string) => {
    setIsSyncing(true);
    setSyncLogs([`[${new Date().toLocaleTimeString()}] Initiating handshake...`]);

    setTimeout(() => {
      setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Authenticating with MISA AMIS... OK`]);

      setTimeout(() => {
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
          setSyncLogs(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] Success! Order ID: ${Math.floor(Math.random() * 100000)}`
          ]);

          setOrders(orders.map(o => (o.id === orderId ? { ...o, internalStatus: "Synced", syncStatus: "synced", syncTarget: "MISA" } : o)));

          if (selectedOrder?.id === orderId) {
            setSelectedOrder({ ...selectedOrder, internalStatus: "Synced", syncStatus: "synced", syncTarget: "MISA" });
          }

          setToastMessage(`Order ${orderId} successfully synced to MISA AMIS`);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
        } else {
          setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Error 500: Timeout`]);
          setOrders(orders.map(o => (o.id === orderId ? { ...o, syncStatus: "error" } : o)));
          if (selectedOrder?.id === orderId) {
            setSelectedOrder({ ...selectedOrder, syncStatus: "error" });
          }
        }

        setIsSyncing(false);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inbound Purchasing Orders</h2>
          <p className="text-gray-500 mt-1">Review dealer orders and sync to ERP (MISA AMIS / Business Central)</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowMappingModal(true)} className="gap-2">
            <MapPin className="h-4 w-4" />
            Data Mapping
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border">
            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
            System Status: Online
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Pending Review</p>
            <h3 className="text-3xl font-bold text-yellow-600 mt-1">{pendingCount}</h3>
            <div className="mt-4 flex items-center text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded w-fit">
              <AlertCircle className="h-3 w-3 mr-1" />
              Requires Action
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Ready to Sync</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-1">{approvedCount}</h3>
            <div className="mt-4 flex items-center text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded w-fit">
              <TrendingUp className="h-3 w-3 mr-1" />
              Can push to ERP
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Sync Errors</p>
            <h3 className="text-3xl font-bold text-red-600 mt-1">{errorCount}</h3>
            <div className="mt-4 flex items-center text-xs text-red-700 bg-red-50 px-2 py-1 rounded w-fit">
              <AlertCircle className="h-3 w-3 mr-1" />
              Check Logs
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <h3 className="text-3xl font-bold text-green-600 mt-1">{orders.length}</h3>
            <div className="mt-4 flex items-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded w-fit">
              <ShoppingCart className="h-3 w-3 mr-1" />
              All time
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="border-b">
          <div className="space-y-4">
            <div>
              <CardTitle>Order List</CardTitle>
              <CardDescription>Filter, review, and process orders from dealers</CardDescription>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === "all" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                  className="rounded-full"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("pending")}
                  className="rounded-full"
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === "approved" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("approved")}
                  className="rounded-full"
                >
                  Ready to Sync
                </Button>
                <Button
                  variant={filterStatus === "error" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("error")}
                  className="rounded-full"
                >
                  Errors
                </Button>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search PO # or Dealer..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Dealer Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount (VND)
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Internal Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ERP Sync
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    onClick={() => handleViewOrder(order)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-600 font-mono">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.dealer}</td>
                    <td className="px-6 py-4 text-gray-500">{order.dateSubmitted}</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-700">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(order.internalStatus)}</td>
                    <td className="px-6 py-4 text-center">{getSyncIcon(order.syncStatus, order.internalStatus)}</td>
                    <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing <span className="font-bold text-gray-800">{filteredOrders.length}</span> orders
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drawer Backdrop */}
      {showDrawer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={handleCloseDrawer}></div>
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 flex flex-col border-l transition-transform duration-300 ${
          showDrawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedOrder && (
          <>
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                <p className="text-xs text-gray-500 font-mono">
                  {selectedOrder.id} • Submitted on {selectedOrder.dateSubmitted}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCloseDrawer} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status Alert */}
              {selectedOrder.syncStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Sync Failed</strong>
                    <br />
                    The system could not map the Dealer Tax ID to MISA AMIS. Check Logs.
                  </div>
                </div>
              )}

              {selectedOrder.internalStatus === "Pending" && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg text-sm flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Review Required</strong>
                    <br />
                    Please verify stock availability and pricing before approving.
                  </div>
                </div>
              )}

              {selectedOrder.syncStatus === "synced" && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Synced Successfully</strong>
                    <br />
                    MISA Reference: ORD-{Math.floor(Math.random() * 10000)}
                  </div>
                </div>
              )}

              {/* Dealer Info */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">Dealer Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-gray-500 text-xs">Dealer Name</span>
                    <span className="block font-medium text-gray-900">{selectedOrder.dealer}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Tax Code</span>
                    <span className="block font-medium text-gray-900">{selectedOrder.dealerTaxId}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Delivery Date</span>
                    <span className="block font-medium text-gray-900">{selectedOrder.deliveryDate}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Contact</span>
                    <span className="block font-medium text-gray-900">Mr. Manager</span>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2 text-gray-500" />
                  Line Items
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-2 text-left">SKU</th>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-center">Qty</th>
                        <th className="px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-mono text-gray-500 text-xs">{item.sku}</td>
                          <td className="px-4 py-3 text-gray-700 font-medium">
                            {item.name}
                            <div className="text-xs text-gray-400">{formatCurrency(item.price)}</div>
                          </td>
                          <td className="px-4 py-3 text-center">{item.qty}</td>
                          <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold text-gray-900">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right">
                          Grand Total:
                        </td>
                        <td className="px-4 py-3 text-right text-blue-700">{formatCurrency(selectedOrder.totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Sync Logs */}
              {syncLogs.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    System Logs
                  </h4>
                  <div className="bg-gray-900 text-gray-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                    {syncLogs.map((log, idx) => (
                      <div key={idx}>&gt; {log}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t bg-gray-50 flex items-center justify-between">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                PDF
              </Button>

              <div className="flex gap-3">
                {selectedOrder.internalStatus === "Pending" && (
                  <>
                    <Button variant="outline" className="text-red-600 border-red-200" onClick={() => handleReject(selectedOrder.id)}>
                      Reject
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => handleApprove(selectedOrder.id)}>
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                  </>
                )}

                {selectedOrder.internalStatus === "Approved" && selectedOrder.syncStatus !== "synced" && (
                  <>
                    <Button variant="ghost" onClick={() => handleApprove(selectedOrder.id)}>
                      Back to Review
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 gap-2"
                      onClick={() => handleSync(selectedOrder.id)}
                      disabled={isSyncing}
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Push to MISA AMIS
                        </>
                      )}
                    </Button>
                  </>
                )}

                {selectedOrder.syncStatus === "synced" && (
                  <div className="px-4 py-2 text-green-600 font-medium text-sm flex items-center border border-green-200 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Synced
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Data Mapping Modal */}
      {showMappingModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Data Logic Mapping</h2>
                  <p className="text-xs text-gray-500">Integration Spec: Portal ↔ MISA AMIS ↔ Dynamics 365 BC</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowMappingModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              {/* Visual Flow */}
              <div className="mb-8 p-6 bg-white rounded-lg border shadow-sm">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Sync Process Flow</h3>
                <div className="flex flex-col md:flex-row items-center justify-between text-center gap-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg w-full md:w-1/4">
                    <div className="text-2xl mb-1">💻</div>
                    <div className="font-bold text-blue-800">Dealer Portal</div>
                    <div className="text-xs text-gray-500">Source (JSON)</div>
                  </div>

                  <ChevronRight className="hidden md:block h-6 w-6 text-gray-300" />
                  <div className="block md:hidden text-gray-300 text-xl">⬇</div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg w-full md:w-1/4 relative">
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Admin Check
                    </div>
                    <div className="text-2xl mb-1">🛡️</div>
                    <div className="font-bold text-yellow-800">Gatekeeper</div>
                    <div className="text-xs text-gray-500">Validation & Mapping</div>
                  </div>

                  <ChevronRight className="hidden md:block h-6 w-6 text-gray-300" />
                  <div className="block md:hidden text-gray-300 text-xl">⬇</div>

                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg w-full md:w-1/4">
                    <div className="text-2xl mb-1">🏢</div>
                    <div className="font-bold text-green-800">ERP System</div>
                    <div className="text-xs text-gray-500">MISA / D365 BC</div>
                  </div>
                </div>
              </div>

              {/* Mapping Table */}
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
                  <h3 className="font-bold text-gray-900">Field Mapping Specification</h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded">v1.2 Updated</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Portal Field (Source)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">
                          MISA AMIS (Dest 1)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-purple-700 uppercase">
                          Dynamics 365 BC (Dest 2)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Data Rules / Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="bg-gray-50/50">
                        <td colSpan={4} className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Order Header Info
                        </td>
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-600">po_id</td>
                        <td className="px-4 py-3 font-mono text-blue-600">order_ref_no</td>
                        <td className="px-4 py-3 font-mono text-purple-600">External Document No.</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">Primary Key for deduplication.</td>
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-600">dealer_tax_id</td>
                        <td className="px-4 py-3 font-mono text-blue-600">account_object_code</td>
                        <td className="px-4 py-3 font-mono text-purple-600">Customer No.</td>
                        <td className="px-4 py-3 text-xs">
                          <span className="bg-red-100 text-red-700 px-1 rounded font-semibold">CRITICAL</span> Must match
                          existing Customer Master Data.
                        </td>
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-600">delivery_date</td>
                        <td className="px-4 py-3 font-mono text-blue-600">delivery_date</td>
                        <td className="px-4 py-3 font-mono text-purple-600">Requested Delivery Date</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">Format: YYYY-MM-DD. Validation: Date &gt;= Today + 3.</td>
                      </tr>

                      <tr className="bg-gray-50/50">
                        <td colSpan={4} className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Line Items (Array)
                        </td>
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-600">product_sku</td>
                        <td className="px-4 py-3 font-mono text-blue-600">inventory_item_code</td>
                        <td className="px-4 py-3 font-mono text-purple-600">Item No.</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">Mapped via SKU table. If not found → Error.</td>
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-600">quantity</td>
                        <td className="px-4 py-3 font-mono text-blue-600">quantity</td>
                        <td className="px-4 py-3 font-mono text-purple-600">Quantity</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">Decimal (2 precision). Must be &gt; 0.</td>
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-600">unit_price</td>
                        <td className="px-4 py-3 font-mono text-blue-600">unit_price</td>
                        <td className="px-4 py-3 font-mono text-purple-600">Unit Price</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">Price Excl. VAT. Source of Truth: Portal Price List.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-white flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowMappingModal(false)}>
                Close
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Download className="h-4 w-4" />
                Download JSON Schema
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[60] bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-right">
          <CheckCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Success!</p>
            <p className="text-sm text-green-100">{toastMessage}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowToast(false)} className="text-white hover:bg-green-700">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
