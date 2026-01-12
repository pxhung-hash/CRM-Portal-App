import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  X, 
  ArrowLeft, 
  Save, 
  Settings,
  FileText,
  Layers,
  CheckCircle,
  AlertCircle,
  Search,
  RefreshCw
} from "lucide-react";

interface AddNewElevationProps {
  onClose: () => void;
  onSave?: (elevationData: any) => void;
}

interface BOMItem {
  id: number;
  bomCode: string;
  seriesCode: string;
  windowSystem: string;
  bomType: "outer" | "inner";
  frameDepth: number;
  openDirection: "L" | "R" | "LR";
  handleType: string;
  glassGroove?: number;
}

export function AddNewElevation({ onClose, onSave }: AddNewElevationProps) {
  const [elevationName, setElevationName] = useState("");
  const [series, setSeries] = useState("");
  const [windowType, setWindowType] = useState("");
  const [noOfLeaves, setNoOfLeaves] = useState<number>(1);
  const [hingeDirection, setHingeDirection] = useState("");
  const [openDirection, setOpenDirection] = useState("");
  const [sill, setSill] = useState("");
  const [glassGroove, setGlassGroove] = useState<number>(18);
  const [insectScreen, setInsectScreen] = useState("");
  const [interlockingStile, setInterlockingStile] = useState("");
  const [bigOpening, setBigOpening] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  // BOM Selection states
  const [selectedOuterBOM, setSelectedOuterBOM] = useState<BOMItem | null>(null);
  const [selectedInnerBOM, setSelectedInnerBOM] = useState<BOMItem | null>(null);
  const [matchedOuterBOMs, setMatchedOuterBOMs] = useState<BOMItem[]>([]);
  const [matchedInnerBOMs, setMatchedInnerBOMs] = useState<BOMItem[]>([]);
  const [bomSearchTerm, setBomSearchTerm] = useState("");
  const [autoMatch, setAutoMatch] = useState(true);

  // Sample BOM data (in production, this would come from a database)
  const outerBOMs: BOMItem[] = [
    {
      id: 1,
      bomCode: "U4E-41001",
      seriesCode: "IWS",
      windowSystem: "SD",
      bomType: "outer",
      frameDepth: 75,
      openDirection: "L",
      handleType: "Single Lock"
    },
    {
      id: 2,
      bomCode: "U4E-41002",
      seriesCode: "IWS",
      windowSystem: "SD",
      bomType: "outer",
      frameDepth: 75,
      openDirection: "R",
      handleType: "Single Lock"
    },
    {
      id: 3,
      bomCode: "U4E-41003",
      seriesCode: "IWE",
      windowSystem: "CS",
      bomType: "outer",
      frameDepth: 75,
      openDirection: "L",
      handleType: "Multipoint Lock"
    },
    {
      id: 4,
      bomCode: "U4E-41004",
      seriesCode: "IWE",
      windowSystem: "CS",
      bomType: "outer",
      frameDepth: 90,
      openDirection: "R",
      handleType: "Multipoint Lock"
    }
  ];

  const innerBOMs: BOMItem[] = [
    {
      id: 1,
      bomCode: "U4I-51001",
      seriesCode: "IWS",
      windowSystem: "SD",
      bomType: "inner",
      frameDepth: 75,
      glassGroove: 18,
      openDirection: "L",
      handleType: "Single Lock"
    },
    {
      id: 2,
      bomCode: "U4I-51002",
      seriesCode: "IWS",
      windowSystem: "SD",
      bomType: "inner",
      frameDepth: 75,
      glassGroove: 18,
      openDirection: "R",
      handleType: "Single Lock"
    },
    {
      id: 3,
      bomCode: "U4I-51003",
      seriesCode: "IWE",
      windowSystem: "CS",
      bomType: "inner",
      frameDepth: 75,
      glassGroove: 32,
      openDirection: "L",
      handleType: "Multipoint Lock"
    },
    {
      id: 4,
      bomCode: "U4I-51004",
      seriesCode: "IWE",
      windowSystem: "CS",
      bomType: "inner",
      frameDepth: 90,
      glassGroove: 32,
      openDirection: "R",
      handleType: "Multipoint Lock"
    }
  ];

  // Series options
  const seriesOptions = ["IWS", "IWE", "IWN", "IWP"];
  
  // Window Type options
  const windowTypeOptions = ["SD", "DO", "CS", "TH", "FX", "LO", "AW", "HO", "PJ"];
  
  // No of Leaves options
  const leavesOptions = [1, 2, 3, 4, 6, 8];
  
  // Hinge Direction options
  const hingeDirectionOptions = ["R", "L", "None", "Both"];
  
  // Open Direction options
  const openDirectionOptions = ["IN", "Out", "None"];
  
  // Sill options
  const sillOptions = ["Step", "Flat", "None", "Regular", "Low"];
  
  // Glass Groove options
  const glassGrooveOptions = [18, 24, 28, 32];
  
  // Insect Screen options
  const insectScreenOptions = ["IS", "No"];
  
  // Interlocking Stile options
  const interlockingStileOptions = ["A", "B", "C", "D", "E", "F", "S", "None"];

  // Auto-generate elevation code whenever any field changes
  useEffect(() => {
    if (series && windowType && hingeDirection && openDirection && sill && insectScreen && interlockingStile) {
      const code = `${series}-${windowType}-${noOfLeaves}-${hingeDirection}-${openDirection}-${sill}-${glassGroove}-${insectScreen}-${interlockingStile}-${bigOpening ? "Yes" : "No"}`;
      setGeneratedCode(code);
    } else {
      setGeneratedCode("");
    }
  }, [series, windowType, noOfLeaves, hingeDirection, openDirection, sill, glassGroove, insectScreen, interlockingStile, bigOpening]);

  // Auto-match BOMs whenever any field changes
  useEffect(() => {
    if (autoMatch) {
      const outerMatches = outerBOMs.filter(bom => 
        bom.seriesCode === series && bom.windowSystem === windowType && bom.openDirection === openDirection
      );
      const innerMatches = innerBOMs.filter(bom => 
        bom.seriesCode === series && bom.windowSystem === windowType && bom.openDirection === openDirection
      );
      setMatchedOuterBOMs(outerMatches);
      setMatchedInnerBOMs(innerMatches);
    }
  }, [series, windowType, openDirection, autoMatch]);

  const handleSave = () => {
    if (!isFormValid()) {
      alert("Please fill all required fields!");
      return;
    }

    const elevationData = {
      id: Date.now(),
      elevationCode: generatedCode,
      elevationName,
      series,
      windowType,
      noOfLeaves,
      hingeDirection,
      openDirection,
      sill,
      glassGroove,
      insectScreen,
      interlockingStile,
      bigOpening,
      status: "Active",
      lastModified: new Date().toISOString().split('T')[0],
      outerBOM: selectedOuterBOM,
      innerBOM: selectedInnerBOM
    };

    onSave && onSave(elevationData);
    alert(`Elevation "${elevationName}" (${generatedCode}) created successfully!`);
    onClose();
  };

  const isFormValid = () => {
    return (
      elevationName.trim() !== "" &&
      series.trim() !== "" &&
      windowType.trim() !== "" &&
      hingeDirection.trim() !== "" &&
      openDirection.trim() !== "" &&
      sill.trim() !== "" &&
      insectScreen.trim() !== "" &&
      interlockingStile.trim() !== ""
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-auto py-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-blue-50">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h2 className="text-gray-900 mb-1">Add New Elevation</h2>
              <p className="text-sm text-gray-500">Configure a new elevation specification</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Generated Elevation Code Display */}
          {generatedCode && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Generated Elevation Code</p>
                    <p className="text-lg font-mono font-bold text-blue-900">{generatedCode}</p>
                  </div>
                  <Badge className="bg-blue-600 text-white">Auto-Generated</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Elevation Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Sliding Door 2 Leaves"
                    value={elevationName}
                    onChange={(e) => setElevationName(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Elevation Configuration Factors */}
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Elevation Configuration Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Series */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Series <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                  >
                    <option value="">Select Series</option>
                    {seriesOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Window Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Window Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={windowType}
                    onChange={(e) => setWindowType(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    {windowTypeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    SD=Sliding Door, DO=Double Opening, CS=Casement, TH=Tilt&Turn, FX=Fixed, LO=Louver
                  </p>
                </div>

                {/* No of Leaves */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No of Leaves <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={noOfLeaves}
                    onChange={(e) => setNoOfLeaves(Number(e.target.value))}
                  >
                    {leavesOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Hinge Direction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hinge Direction <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={hingeDirection}
                    onChange={(e) => setHingeDirection(e.target.value)}
                  >
                    <option value="">Select Direction</option>
                    {hingeDirectionOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Open Direction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Direction <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={openDirection}
                    onChange={(e) => setOpenDirection(e.target.value)}
                  >
                    <option value="">Select Direction</option>
                    {openDirectionOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Sill */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sill <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={sill}
                    onChange={(e) => setSill(e.target.value)}
                  >
                    <option value="">Select Sill Type</option>
                    {sillOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Glass Groove */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Glass Groove (mm) <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={glassGroove}
                    onChange={(e) => setGlassGroove(Number(e.target.value))}
                  >
                    {glassGrooveOptions.map(option => (
                      <option key={option} value={option}>{option}mm</option>
                    ))}
                  </select>
                </div>

                {/* Insect Screen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insect Screen <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={insectScreen}
                    onChange={(e) => setInsectScreen(e.target.value)}
                  >
                    <option value="">Select Option</option>
                    {insectScreenOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Interlocking Stile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interlocking Stile <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={interlockingStile}
                    onChange={(e) => setInterlockingStile(e.target.value)}
                  >
                    <option value="">Select Stile</option>
                    {interlockingStileOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                Additional Options
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="bigOpening"
                  checked={bigOpening}
                  onChange={(e) => setBigOpening(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="bigOpening" className="text-sm font-medium text-gray-700">
                  Big Opening
                </label>
                <Badge className={bigOpening ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}>
                  {bigOpening ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* BOM Selection */}
          <Card>
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  BOM Configuration Setup
                </CardTitle>
                <Badge className={selectedOuterBOM && selectedInnerBOM ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                  {selectedOuterBOM && selectedInnerBOM ? "Complete" : "Incomplete"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-2">One Elevation = 1 Outer BOM + 1 Inner BOM</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Auto Match Toggle */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="autoMatch"
                    checked={autoMatch}
                    onChange={(e) => setAutoMatch(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="autoMatch" className="text-sm font-medium text-gray-700">
                    Auto-Match BOMs Based on Factors
                  </label>
                </div>
                <Badge className={autoMatch ? "bg-green-600 text-white" : "bg-gray-400 text-white"}>
                  {autoMatch ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search BOM codes manually..."
                  value={bomSearchTerm}
                  onChange={(e) => setBomSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Matching Status */}
              {autoMatch && (series || windowType || openDirection) && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className={`h-4 w-4 ${matchedOuterBOMs.length > 0 ? "text-green-600" : "text-gray-400"}`} />
                      <p className="text-sm font-medium text-gray-700">Outer BOMs Matched</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{matchedOuterBOMs.length}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on: {series || "?"} / {windowType || "?"} / {openDirection || "?"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className={`h-4 w-4 ${matchedInnerBOMs.length > 0 ? "text-green-600" : "text-gray-400"}`} />
                      <p className="text-sm font-medium text-gray-700">Inner BOMs Matched</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{matchedInnerBOMs.length}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on: {series || "?"} / {windowType || "?"} / {openDirection || "?"}
                    </p>
                  </div>
                </div>
              )}

              {/* Outer BOM Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Outer BOM <span className="text-red-500">*</span>
                  </label>
                  {selectedOuterBOM && (
                    <Badge className="bg-blue-100 text-blue-700">Selected</Badge>
                  )}
                </div>
                <select
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                  value={selectedOuterBOM ? selectedOuterBOM.id : ""}
                  onChange={(e) => setSelectedOuterBOM(
                    outerBOMs.find(bom => bom.id === Number(e.target.value)) || null
                  )}
                >
                  <option value="">Select Outer BOM...</option>
                  {(autoMatch ? matchedOuterBOMs : outerBOMs)
                    .filter(bom => 
                      bom.bomCode.toLowerCase().includes(bomSearchTerm.toLowerCase()) ||
                      bom.handleType.toLowerCase().includes(bomSearchTerm.toLowerCase())
                    )
                    .map(bom => (
                      <option key={bom.id} value={bom.id}>
                        {bom.bomCode} - {bom.seriesCode} / {bom.windowSystem} / {bom.openDirection} / {bom.handleType} / {bom.frameDepth}mm
                      </option>
                    ))}
                </select>
                {selectedOuterBOM && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">BOM Code:</p>
                        <p className="font-mono font-medium text-gray-900">{selectedOuterBOM.bomCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Series:</p>
                        <p className="font-medium text-gray-900">{selectedOuterBOM.seriesCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Window System:</p>
                        <p className="font-medium text-gray-900">{selectedOuterBOM.windowSystem}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Open Direction:</p>
                        <p className="font-medium text-gray-900">{selectedOuterBOM.openDirection}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Frame Depth:</p>
                        <p className="font-medium text-gray-900">{selectedOuterBOM.frameDepth}mm</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Handle Type:</p>
                        <p className="font-medium text-gray-900">{selectedOuterBOM.handleType}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Inner BOM Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Inner BOM <span className="text-red-500">*</span>
                  </label>
                  {selectedInnerBOM && (
                    <Badge className="bg-green-100 text-green-700">Selected</Badge>
                  )}
                </div>
                <select
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                  value={selectedInnerBOM ? selectedInnerBOM.id : ""}
                  onChange={(e) => setSelectedInnerBOM(
                    innerBOMs.find(bom => bom.id === Number(e.target.value)) || null
                  )}
                >
                  <option value="">Select Inner BOM...</option>
                  {(autoMatch ? matchedInnerBOMs : innerBOMs)
                    .filter(bom => 
                      bom.bomCode.toLowerCase().includes(bomSearchTerm.toLowerCase()) ||
                      bom.handleType.toLowerCase().includes(bomSearchTerm.toLowerCase())
                    )
                    .map(bom => (
                      <option key={bom.id} value={bom.id}>
                        {bom.bomCode} - {bom.seriesCode} / {bom.windowSystem} / {bom.openDirection} / {bom.handleType} / {bom.glassGroove}mm
                      </option>
                    ))}
                </select>
                {selectedInnerBOM && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">BOM Code:</p>
                        <p className="font-mono font-medium text-gray-900">{selectedInnerBOM.bomCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Series:</p>
                        <p className="font-medium text-gray-900">{selectedInnerBOM.seriesCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Window System:</p>
                        <p className="font-medium text-gray-900">{selectedInnerBOM.windowSystem}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Open Direction:</p>
                        <p className="font-medium text-gray-900">{selectedInnerBOM.openDirection}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Frame Depth:</p>
                        <p className="font-medium text-gray-900">{selectedInnerBOM.frameDepth}mm</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Glass Groove:</p>
                        <p className="font-medium text-gray-900">{selectedInnerBOM.glassGroove}mm</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Handle Type:</p>
                        <p className="font-medium text-gray-900">{selectedInnerBOM.handleType}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Warning if BOMs not selected */}
              {(!selectedOuterBOM || !selectedInnerBOM) && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">BOM Selection Required</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Please select both Outer BOM and Inner BOM to complete the elevation configuration.
                      {!autoMatch && " Enable Auto-Match to filter BOMs based on your configuration factors."}
                    </p>
                  </div>
                </div>
              )}

              {/* Success if both BOMs selected */}
              {selectedOuterBOM && selectedInnerBOM && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">BOM Configuration Complete</p>
                    <p className="text-sm text-green-700 mt-1">
                      Outer BOM: <span className="font-mono">{selectedOuterBOM.bomCode}</span> + Inner BOM: <span className="font-mono">{selectedInnerBOM.bomCode}</span>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              className="gap-2" 
              onClick={handleSave}
              disabled={!isFormValid()}
            >
              <Save className="h-4 w-4" />
              Save Elevation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}