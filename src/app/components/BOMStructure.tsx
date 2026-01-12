import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Package,
  FileText,
  Layers,
  Grid3x3
} from "lucide-react";
import { AddNewBOM } from "./AddNewBOM";

interface BOMItem {
  id: number;
  bomCode: string;
  bomName: string;
  seriesCode: string;
  windowSystem: string;
  bomType: "outer" | "inner" | "connector";
  frameDepth: number;
  openDirection: "L" | "R" | "LR";
  totalParts: number;
  status: "Active" | "Draft" | "Archived";
  lastModified: string;
}

export function BOMStructure() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeries, setFilterSeries] = useState<string>("all");
  const [showAddNewBOM, setShowAddNewBOM] = useState(false);
  const [activeTab, setActiveTab] = useState<"outer" | "inner" | "connector">("outer");

  // Sample BOM data
  const [bomList] = useState<BOMItem[]>([
    {
      id: 1,
      bomCode: "BOM-OUT-330-001",
      bomName: "Casement Window 330 Series",
      seriesCode: "YKK330",
      windowSystem: "Casement Window",
      bomType: "outer",
      frameDepth: 70,
      openDirection: "L",
      totalParts: 24,
      status: "Active",
      lastModified: "2025-01-10"
    },
    {
      id: 2,
      bomCode: "BOM-OUT-330-002",
      bomName: "Sliding Window 330 Series",
      seriesCode: "YKK330",
      windowSystem: "Sliding Window",
      bomType: "outer",
      frameDepth: 70,
      openDirection: "LR",
      totalParts: 18,
      status: "Active",
      lastModified: "2025-01-09"
    },
    {
      id: 3,
      bomCode: "BOM-OUT-430-001",
      bomName: "Fixed Window 430 Series",
      seriesCode: "YKK430",
      windowSystem: "Fixed Window",
      bomType: "outer",
      frameDepth: 50,
      openDirection: "L",
      totalParts: 12,
      status: "Active",
      lastModified: "2025-01-08"
    },
    {
      id: 4,
      bomCode: "BOM-INN-330-001",
      bomName: "Casement Inner BOM 330",
      seriesCode: "YKK330",
      windowSystem: "Casement Window",
      bomType: "inner",
      frameDepth: 70,
      openDirection: "R",
      totalParts: 16,
      status: "Active",
      lastModified: "2025-01-07"
    },
    {
      id: 5,
      bomCode: "BOM-MOD-330-001",
      bomName: "Module BOM 330 Series",
      seriesCode: "YKK330",
      windowSystem: "Modular System",
      bomType: "connector",
      frameDepth: 70,
      openDirection: "LR",
      totalParts: 32,
      status: "Draft",
      lastModified: "2025-01-06"
    },
    {
      id: 6,
      bomCode: "BOM-OUT-430-002",
      bomName: "Awning Window 430 Series",
      seriesCode: "YKK430",
      windowSystem: "Awning Window",
      bomType: "outer",
      frameDepth: 50,
      openDirection: "L",
      totalParts: 20,
      status: "Active",
      lastModified: "2025-01-05"
    }
  ]);

  const getBomTypeColor = (type: string) => {
    switch (type) {
      case "outer":
        return "bg-blue-100 text-blue-700";
      case "inner":
        return "bg-green-100 text-green-700";
      case "connector":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Draft":
        return "bg-yellow-100 text-yellow-700";
      case "Archived":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDirectionBadgeColor = (direction: string) => {
    switch (direction) {
      case "L":
        return "bg-blue-100 text-blue-700";
      case "R":
        return "bg-green-100 text-green-700";
      case "LR":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredBoms = bomList.filter((bom) => {
    const matchesSearch =
      bom.bomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.bomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.seriesCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.windowSystem.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || bom.bomType === filterType;
    const matchesSeries = filterSeries === "all" || bom.seriesCode === filterSeries;
    const matchesTab = bom.bomType === activeTab;

    return matchesSearch && matchesType && matchesSeries && matchesTab;
  });

  const uniqueSeries = Array.from(new Set(bomList.map(bom => bom.seriesCode)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">BOM Structure Management</h2>
          <p className="text-gray-500 mt-1">Manage Bill of Materials for all window systems</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddNewBOM(true)}>
          <Plus className="h-4 w-4" />
          Create New BOM
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total BOMs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{bomList.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Outer BOMs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {bomList.filter(b => b.bomType === "outer").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inner BOMs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {bomList.filter(b => b.bomType === "inner").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Grid3x3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Module BOMs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {bomList.filter(b => b.bomType === "connector").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search BOM code, name, series..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="all">All Types</option>
                <option value="outer">Outer BOM</option>
                <option value="inner">Inner BOM</option>
                <option value="connector">Module BOM</option>
              </select>
            </div>
            <div>
              <select
                value={filterSeries}
                onChange={(e) => setFilterSeries(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="all">All Series</option>
                {uniqueSeries.map(series => (
                  <option key={series} value={series}>{series}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BOM List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>BOM List ({filteredBoms.length} items)</span>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export List
            </Button>
          </CardTitle>
        </CardHeader>
        
        {/* Tab Navigation */}
        <div className="border-b px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("outer")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "outer"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Outer
                <Badge className={activeTab === "outer" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}>
                  {bomList.filter(b => b.bomType === "outer").length}
                </Badge>
              </div>
              {activeTab === "outer" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("inner")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "inner"
                  ? "text-green-600 bg-green-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4" />
                Inner
                <Badge className={activeTab === "inner" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}>
                  {bomList.filter(b => b.bomType === "inner").length}
                </Badge>
              </div>
              {activeTab === "inner" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("connector")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "connector"
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Connector
                <Badge className={activeTab === "connector" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}>
                  {bomList.filter(b => b.bomType === "connector").length}
                </Badge>
              </div>
              {activeTab === "connector" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">BOM Code</th>
                  <th className="text-left p-4 font-medium text-gray-700">BOM Name</th>
                  <th className="text-left p-4 font-medium text-gray-700">Series</th>
                  <th className="text-left p-4 font-medium text-gray-700">Window System</th>
                  <th className="text-left p-4 font-medium text-gray-700">Type</th>
                  <th className="text-left p-4 font-medium text-gray-700">Frame Depth</th>
                  <th className="text-left p-4 font-medium text-gray-700">Direction</th>
                  <th className="text-left p-4 font-medium text-gray-700">Total Parts</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Last Modified</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBoms.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-gray-500">
                      No BOMs found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredBoms.map((bom) => (
                    <tr key={bom.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-mono text-sm text-gray-900">{bom.bomCode}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-900">{bom.bomName}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {bom.seriesCode}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{bom.windowSystem}</span>
                      </td>
                      <td className="p-4">
                        <Badge className={getBomTypeColor(bom.bomType)}>
                          {bom.bomType.charAt(0).toUpperCase() + bom.bomType.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{bom.frameDepth}mm</span>
                      </td>
                      <td className="p-4">
                        <Badge className={getDirectionBadgeColor(bom.openDirection)}>
                          {bom.openDirection}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-900 font-medium">{bom.totalParts}</span>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(bom.status)}>
                          {bom.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{bom.lastModified}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add New BOM Modal */}
      {showAddNewBOM && (
        <AddNewBOM onClose={() => setShowAddNewBOM(false)} />
      )}
    </div>
  );
}