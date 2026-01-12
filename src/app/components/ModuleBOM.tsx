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
  Grid3x3,
  X,
  ExternalLink,
  BarChart3,
  Wind,
  Droplets,
  Copy
} from "lucide-react";
import { AddNewElevation } from "./AddNewElevation";
import windowElevationImage from "figma:asset/9feadb970b796b1bb6e2568e4a0ec5369851912f.png";

interface ElevationItem {
  id: number;
  elevationCode: string;
  elevationName: string;
  series: string;
  windowType: string;
  noOfLeaves: number;
  hingeDirection: string;
  openDirection: string;
  sill: string;
  glassGroove: number;
  insectScreen: string;
  interlockingStile: string;
  bigOpening: boolean;
  status: "Active" | "Draft" | "Archived";
  lastModified: string;
  outerBOM?: string;
  innerBOM?: string;
  windPressure?: number;
  waterproof?: number;
  usageCount?: number;
  fabPortalEnabled?: boolean;
}

export function ModuleBOM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeries, setFilterSeries] = useState<string>("all");
  const [filterWindowType, setFilterWindowType] = useState<string>("all");
  const [showAddNewElevation, setShowAddNewElevation] = useState(false);
  const [selectedElevation, setSelectedElevation] = useState<ElevationItem | null>(null);

  // Sample Elevation data
  const [elevationList] = useState<ElevationItem[]>([
    {
      id: 1,
      elevationCode: "IWS-SD-2-R-IN-Step-18-IS-A-Yes",
      elevationName: "Sliding Door 2 Leaves",
      series: "IWS",
      windowType: "SD",
      noOfLeaves: 2,
      hingeDirection: "R",
      openDirection: "IN",
      sill: "Step",
      glassGroove: 18,
      insectScreen: "IS",
      interlockingStile: "A",
      bigOpening: true,
      status: "Active",
      lastModified: "2025-01-10"
    },
    {
      id: 2,
      elevationCode: "IWE-CS-1-L-Out-Flat-32-No-B-No",
      elevationName: "Casement Window Single",
      series: "IWE",
      windowType: "CS",
      noOfLeaves: 1,
      hingeDirection: "L",
      openDirection: "Out",
      sill: "Flat",
      glassGroove: 32,
      insectScreen: "No",
      interlockingStile: "B",
      bigOpening: false,
      status: "Active",
      lastModified: "2025-01-09"
    },
    {
      id: 3,
      elevationCode: "IWS-FX-4-None-None-Regular-18-No-C-No",
      elevationName: "Fixed Window 4 Panel",
      series: "IWS",
      windowType: "FX",
      noOfLeaves: 4,
      hingeDirection: "None",
      openDirection: "None",
      sill: "Regular",
      glassGroove: 18,
      insectScreen: "No",
      interlockingStile: "C",
      bigOpening: false,
      status: "Active",
      lastModified: "2025-01-08"
    },
    {
      id: 4,
      elevationCode: "IWE-DO-2-R-IN-Step-32-IS-D-Yes",
      elevationName: "Double Opening 2 Leaves",
      series: "IWE",
      windowType: "DO",
      noOfLeaves: 2,
      hingeDirection: "R",
      openDirection: "IN",
      sill: "Step",
      glassGroove: 32,
      insectScreen: "IS",
      interlockingStile: "D",
      bigOpening: true,
      status: "Active",
      lastModified: "2025-01-07"
    },
    {
      id: 5,
      elevationCode: "IWS-TH-3-L-Out-None-18-No-E-No",
      elevationName: "Tilt & Turn 3 Leaves",
      series: "IWS",
      windowType: "TH",
      noOfLeaves: 3,
      hingeDirection: "L",
      openDirection: "Out",
      sill: "None",
      glassGroove: 18,
      insectScreen: "No",
      interlockingStile: "E",
      bigOpening: false,
      status: "Draft",
      lastModified: "2025-01-06"
    },
    {
      id: 6,
      elevationCode: "IWE-LO-6-None-IN-Regular-32-IS-F-Yes",
      elevationName: "Louver Window 6 Panel",
      series: "IWE",
      windowType: "LO",
      noOfLeaves: 6,
      hingeDirection: "None",
      openDirection: "IN",
      sill: "Regular",
      glassGroove: 32,
      insectScreen: "IS",
      interlockingStile: "F",
      bigOpening: true,
      status: "Active",
      lastModified: "2025-01-05"
    }
  ]);

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

  const getSeriesColor = (series: string) => {
    switch (series) {
      case "IWS":
        return "bg-blue-100 text-blue-700";
      case "IWE":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredElevations = elevationList.filter((elevation) => {
    const matchesSearch =
      elevation.elevationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elevation.elevationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elevation.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elevation.windowType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeries = filterSeries === "all" || elevation.series === filterSeries;
    const matchesWindowType = filterWindowType === "all" || elevation.windowType === filterWindowType;

    return matchesSearch && matchesSeries && matchesWindowType;
  });

  const uniqueSeries = Array.from(new Set(elevationList.map(elev => elev.series)));
  const uniqueWindowTypes = Array.from(new Set(elevationList.map(elev => elev.windowType)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Elevation Configuration</h2>
          <p className="text-gray-500 mt-1">Manage and configure window elevation specifications</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddNewElevation(true)}>
          <Plus className="h-4 w-4" />
          Add New Elevation
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Elevations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{elevationList.length}</p>
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
                <p className="text-sm text-gray-500">IWS Series</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {elevationList.filter(e => e.series === "IWS").length}
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
                <p className="text-sm text-gray-500">IWE Series</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {elevationList.filter(e => e.series === "IWE").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Grid3x3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">With Insect Screen</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {elevationList.filter(e => e.insectScreen === "IS").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
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
                  placeholder="Search elevation code, name, series..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
            <div>
              <select
                value={filterWindowType}
                onChange={(e) => setFilterWindowType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="all">All Window Types</option>
                {uniqueWindowTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content with Table and Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Elevation List Table */}
        <div className={selectedElevation ? "lg:col-span-2" : "lg:col-span-3"}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Elevation List ({filteredElevations.length} items)</span>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export List
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-700">Elevation Code</th>
                      <th className="text-left p-4 font-medium text-gray-700">Elevation Name</th>
                      <th className="text-left p-4 font-medium text-gray-700">Series</th>
                      <th className="text-left p-4 font-medium text-gray-700">Window Type</th>
                      <th className="text-left p-4 font-medium text-gray-700">Leaves</th>
                      <th className="text-left p-4 font-medium text-gray-700">Glass Groove</th>
                      <th className="text-left p-4 font-medium text-gray-700">Status</th>
                      <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredElevations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500">
                          No elevations found matching your criteria
                        </td>
                      </tr>
                    ) : (
                      filteredElevations.map((elevation) => (
                        <tr 
                          key={elevation.id} 
                          onClick={() => setSelectedElevation(elevation)}
                          className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedElevation?.id === elevation.id ? "bg-blue-50" : ""
                          }`}
                        >
                          <td className="p-4">
                            <span className="font-mono text-xs text-gray-900">{elevation.elevationCode}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-900">{elevation.elevationName}</span>
                          </td>
                          <td className="p-4">
                            <Badge className={getSeriesColor(elevation.series)}>
                              {elevation.series}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="bg-orange-50 text-orange-700">
                              {elevation.windowType}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-900 font-medium">{elevation.noOfLeaves}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-600">{elevation.glassGroove}mm</span>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(elevation.status)}>
                              {elevation.status}
                            </Badge>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
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
        </div>

        {/* Quick Info Panel */}
        {selectedElevation && (
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Quick Info</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => setSelectedElevation(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Window Type Preview */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <img 
                    src={windowElevationImage} 
                    alt="Window Elevation Reference" 
                    className="w-full h-auto"
                  />
                </div>

                {/* Elevation Info */}
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{selectedElevation.elevationName}</p>
                  <p className="text-xs font-mono text-gray-500">{selectedElevation.elevationCode}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getSeriesColor(selectedElevation.series)}>
                      {selectedElevation.series}
                    </Badge>
                    <Badge variant="outline">{selectedElevation.glassGroove}mm</Badge>
                    <Badge variant="outline">{selectedElevation.noOfLeaves}L</Badge>
                  </div>
                </div>

                {/* Linked BOMs */}
                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Layers className="h-4 w-4" />
                    <span className="font-medium">Linked BOMs</span>
                  </div>

                  {/* Outer BOM */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-medium text-green-900">Outer BOM</span>
                    </div>
                    <p className="text-sm font-mono text-green-700 mb-2">
                      BOM-OUT-{selectedElevation.series}-{selectedElevation.windowType}-{selectedElevation.noOfLeaves}L-{selectedElevation.glassGroove}
                    </p>
                    <button className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                      View Details <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Inner BOM */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-900">Inner BOM</span>
                    </div>
                    <p className="text-sm font-mono text-purple-700 mb-2">
                      BOM-INN-{selectedElevation.series}-{selectedElevation.windowType}-2L-CRE
                    </p>
                    <button className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                      View Details <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Performance Specs */}
                <div className="space-y-3 pt-3 border-t">
                  <p className="font-medium text-gray-700 text-sm">Performance Specs</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Wind className="h-4 w-4 text-gray-600" />
                        <p className="text-xs text-gray-600">Wind Pressure</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">2000Pa</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Droplets className="h-4 w-4 text-gray-600" />
                        <p className="text-xs text-gray-600">Waterproof</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">350Pa</p>
                    </div>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">Usage Statistics</span>
                  </div>
                  <p className="text-3xl font-bold text-orange-600 mb-1">15</p>
                  <p className="text-xs text-orange-700">Used in current project quotes</p>
                </div>

                {/* FAB Portal Status */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">FAB Portal Status</p>
                    <p className="text-xs text-gray-600">Toggle availability for fabricators</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-3 border-t">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Configuration
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Copy className="h-4 w-4" />
                    Duplicate Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Add New Elevation Modal */}
      {showAddNewElevation && (
        <AddNewElevation onClose={() => setShowAddNewElevation(false)} />
      )}
    </div>
  );
}