'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, Rect, Circle, IText, FabricObject } from 'fabric';

export default function ScienceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: true,
    });

    // Enable object controls for resize/rotate
    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    setCanvas(fabricCanvas);

    // Cleanup
    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const addRectangle = () => {
    if (!canvas) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 120,
      height: 80,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
      rx: 8,
      ry: 8,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new Circle({
      left: 250,
      top: 150,
      radius: 50,
      fill: '#10b981',
      stroke: '#047857',
      strokeWidth: 2,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addText = () => {
    if (!canvas) return;
    const text = new IText('Label', {
      left: 400,
      top: 200,
      fontSize: 24,
      fill: '#1f2937',
      fontFamily: 'Arial',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas || !selectedObject) return;
    canvas.remove(selectedObject);
    canvas.discardActiveObject();
    canvas.renderAll();
    setSelectedObject(null);
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.set('backgroundColor', '#ffffff');
    canvas.renderAll();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={addRectangle}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Rectangle
        </button>
        <button
          onClick={addCircle}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add Circle
        </button>
        <button
          onClick={addText}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          Add Text
        </button>
        <button
          onClick={deleteSelected}
          disabled={!selectedObject}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
        >
          Delete Selected
        </button>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          Clear Canvas
        </button>
      </div>

      <div className="border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>

      <p className="text-sm text-gray-600 mt-2">
        Click and drag objects. Use corner handles to resize and rotate.
        {selectedObject && ' | Object selected'}
      </p>
    </div>
  );
}
