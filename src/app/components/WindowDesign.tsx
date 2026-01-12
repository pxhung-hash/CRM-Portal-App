import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Grid3x3,
  Plus,
  Minus,
  Undo,
  RotateCcw,
  Download,
  Settings,
  Info,
  ChevronRight,
  Eye
} from "lucide-react";

interface GridCell {
  id: string;
  row: number;
  col: number;
  windowType: string;
  elevationCode: string;
  width: number;
  height: number;
}

interface WindowType {
  id: string;
  name: string;
  code: string;
  icon: string;
  description: string;
}

export function WindowDesign() {
  const [activeTab, setActiveTab] = useState<"input" | "design" | "details" | "projects">("input");
  const [totalWidth, setTotalWidth] = useState<number>(3000);
  const [totalHeight, setTotalHeight] = useState<number>(2400);
  const [gridRows, setGridRows] = useState<number>(2);
  const [gridCols, setGridCols] = useState<number>(2);
  const [selectedWindowType, setSelectedWindowType] = useState<string>("SD");
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [cells, setCells] = useState<GridCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
  const [joinType, setJoinType] = useState<"transom" | "mullion">("mullion");

  // Window type options
  const windowTypes: WindowType[] = [
    { id: "FX", name: "Fixed", code: "FX", icon: "⬜", description: "Fixed Window" },
    { id: "FD", name: "Folding Door", code: "FD", icon: "🚪", description: "Folding Door System" },
    { id: "LO", name: "Louver", code: "LO", icon: "▦", description: "Louver Window" },
    { id: "SD", name: "Sliding", code: "SD", icon: "⇄", description: "Sliding Window/Door" },
    { id: "TH", name: "Top Hung", code: "TH", icon: "⤴", description: "Top Hung Window" },
    { id: "CS", name: "Casement", code: "CS", icon: "↗", description: "Casement Window" },
    { id: "AW", name: "Awning", code: "AW", icon: "⤵", description: "Awning Window" },
    { id: "DO", name: "Double Opening", code: "DO", icon: "⇆", description: "Double Opening Window" }
  ];

  // Initialize grid
  const initializeGrid = () => {
    const newCells: GridCell[] = [];
    const cellWidth = totalWidth / gridCols;
    const cellHeight = totalHeight / gridRows;

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        newCells.push({
          id: `cell-${row}-${col}`,
          row,
          col,
          windowType: "FX",
          elevationCode: "",
          width: cellWidth,
          height: cellHeight
        });
      }
    }
    setCells(newCells);
  };

  // Update cell with window type
  const updateCellWindowType = (cellId: string, windowType: string) => {
    setCells(cells.map(cell => 
      cell.id === cellId ? { ...cell, windowType, elevationCode: `${windowType}-${cell.row}-${cell.col}` } : cell
    ));
  };

  // Calculate cell dimensions
  const getCellDimensions = (row: number, col: number) => {
    const cellWidth = totalWidth / gridCols;
    const cellHeight = totalHeight / gridRows;
    return { width: cellWidth, height: cellHeight };
  };

  // Get window type display
  const getWindowTypeIcon = (type: string) => {
    const windowType = windowTypes.find(wt => wt.code === type);
    return windowType?.icon || "⬜";
  };

  // Render grid canvas
  const renderGridCanvas = () => {
    if (cells.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Grid3x3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Click "Initialize Grid" to start designing</p>
            <Button onClick={initializeGrid}>
              <Plus className="h-4 w-4 mr-2" />
              Initialize Grid
            </Button>
          </div>
        </div>
      );
    }

    const cellWidth = 100 / gridCols;
    const cellHeight = 100 / gridRows;

    return (
      <div className="relative bg-gray-100 rounded-lg border-2 border-gray-300 p-8" style={{ aspectRatio: `${totalWidth}/${totalHeight}` }}>
        <div className="grid gap-2 h-full" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gridTemplateRows: `repeat(${gridRows}, 1fr)` }}>
          {cells.map((cell) => {
            const dims = getCellDimensions(cell.row, cell.col);
            return (
              <div
                key={cell.id}
                onClick={() => setSelectedCell(cell)}
                className={`relative border-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded cursor-pointer transition-all hover:shadow-lg ${
                  selectedCell?.id === cell.id ? "border-blue-600 ring-2 ring-blue-400" : "border-gray-400"
                }`}
              >
                {/* Window Type Icon */}
                <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-600">
                  {getWindowTypeIcon(cell.windowType)}
                </div>
                
                {/* Cell Info */}
                <div className="absolute top-1 left-1 bg-white/80 px-2 py-1 rounded text-xs font-medium">
                  {cell.windowType}
                </div>

                {/* Dimensions */}
                {showDimensions && (
                  <>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white/90 px-2 py-0.5 rounded text-xs font-mono text-purple-700">
                      W: {Math.round(dims.width)}
                    </div>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/90 px-2 py-0.5 rounded text-xs font-mono text-purple-700 -rotate-90">
                      H: {Math.round(dims.height)}
                    </div>
                  </>
                )}

                {/* Grid position */}
                <div className="absolute bottom-1 right-1 bg-gray-800/70 text-white px-1.5 py-0.5 rounded text-xs">
                  R{cell.row + 1}C{cell.col + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall dimensions */}
        {showDimensions && (
          <>
            {/* Total Width */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
              <div className="bg-purple-600 text-white px-3 py-1 rounded font-mono text-sm">
                {totalWidth} mm
              </div>
            </div>
            {/* Total Height */}
            <div className="absolute -right-12 top-0 bottom-0 flex items-center">
              <div className="bg-purple-600 text-white px-3 py-1 rounded font-mono text-sm -rotate-90">
                {totalHeight} mm
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Window Design</h2>
          <p className="text-gray-500 mt-1">Design custom window configurations with grid-based layout</p>
        </div>
        <Badge className="bg-blue-600 text-white text-sm px-4 py-2">
          NEXSTA - Window Quotation - V1.0
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("input")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "input"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Input
        </button>
        <button
          onClick={() => setActiveTab("design")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "design"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Design
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "details"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Door Details
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "projects"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Projects List
        </button>
      </div>

      {/* Input Tab */}
      {activeTab === "input" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Dimensions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Opening Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (W) - mm
                  </label>
                  <Input
                    type="number"
                    value={totalWidth}
                    onChange={(e) => setTotalWidth(Number(e.target.value))}
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (H) - mm
                  </label>
                  <Input
                    type="number"
                    value={totalHeight}
                    onChange={(e) => setTotalHeight(Number(e.target.value))}
                    placeholder="2400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Grid Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid3x3 className="h-5 w-5 text-blue-600" />
                  Grid Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rows
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGridRows(Math.max(1, gridRows - 1))}
                      disabled={gridRows <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={gridRows}
                      onChange={(e) => setGridRows(Math.max(1, Number(e.target.value)))}
                      className="text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGridRows(Math.min(6, gridRows + 1))}
                      disabled={gridRows >= 6}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Columns
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGridCols(Math.max(1, gridCols - 1))}
                      disabled={gridCols <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={gridCols}
                      onChange={(e) => setGridCols(Math.max(1, Number(e.target.value)))}
                      className="text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGridCols(Math.min(6, gridCols + 1))}
                      disabled={gridCols >= 6}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button className="w-full" onClick={initializeGrid}>
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  Initialize Grid ({gridRows} × {gridCols})
                </Button>
              </CardContent>
            </Card>

            {/* Window Type Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                  Window Type Selector
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {windowTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedWindowType(type.code)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedWindowType === type.code
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.code}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Join Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Join Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <button
                    onClick={() => setJoinType("transom")}
                    className={`flex-1 p-3 border-2 rounded-lg ${
                      joinType === "transom" ? "border-blue-600 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">Transom</div>
                    <div className="text-2xl">▭</div>
                  </button>
                  <button
                    onClick={() => setJoinType("mullion")}
                    className={`flex-1 p-3 border-2 rounded-lg ${
                      joinType === "mullion" ? "border-blue-600 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">Mullion</div>
                    <div className="text-2xl">▯</div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="showDimensions"
                    checked={showDimensions}
                    onChange={(e) => setShowDimensions(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="showDimensions" className="text-sm font-medium text-gray-700">
                    Show Dimensions
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Elevation Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Elevation Code</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Auto-generated elevation code"
                  value={selectedCell?.elevationCode || ""}
                  readOnly
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setCells([])}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline">
                <Undo className="h-4 w-4 mr-2" />
                Undo
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
              <Button variant="outline" className="border-blue-600 text-blue-600">
                <Download className="h-4 w-4 mr-2" />
                Export SVG
              </Button>
            </div>
          </div>

          {/* Right Panel - Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Window Design Canvas</span>
                  {cells.length > 0 && (
                    <Badge variant="outline">
                      {gridRows} × {gridCols} Grid
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {renderGridCanvas()}
              </CardContent>
            </Card>

            {/* Selected Cell Information */}
            {selectedCell && (
              <Card>
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Block Information - {selectedCell.id}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Window Type</p>
                        <p className="font-medium text-gray-900">{selectedCell.windowType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Position</p>
                        <p className="font-medium text-gray-900">Row {selectedCell.row + 1}, Col {selectedCell.col + 1}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Width</p>
                        <p className="font-medium text-gray-900">{Math.round(selectedCell.width)} mm</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Height</p>
                        <p className="font-medium text-gray-900">{Math.round(selectedCell.height)} mm</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Apply Window Type</p>
                      <div className="grid grid-cols-4 gap-2">
                        {windowTypes.map((type) => (
                          <Button
                            key={type.id}
                            variant="outline"
                            size="sm"
                            onClick={() => updateCellWindowType(selectedCell.id, type.code)}
                            className={selectedCell.windowType === type.code ? "border-blue-600 bg-blue-50" : ""}
                          >
                            {type.code}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Design Tab */}
      {activeTab === "design" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Design View</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {renderGridCanvas()}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Block Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cells.map((cell) => (
                  <div key={cell.id} className="p-3 border rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">{cell.windowType}</p>
                    <p className="text-xs text-gray-600">
                      W: {Math.round(cell.width)} / H: {Math.round(cell.height)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Details Tab */}
      {activeTab === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Door Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Detailed specifications for doors will be displayed here.</p>
          </CardContent>
        </Card>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <Card>
          <CardHeader>
            <CardTitle>Projects List</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Saved window design projects will be displayed here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
