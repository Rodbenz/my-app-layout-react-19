import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Box, TextField, Button, Typography, Switch, FormControlLabel, Slider, Card, CardContent } from '@mui/material';

const QRGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [logoSize, setLogoSize] = useState(30); // percentage of QR code size
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code
  const generateQR = async () => {
    if (!text) return;
    
    try {
      // Generate QR code to data URL
      const url = await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H', // High error correction for logo overlay
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrUrl(url);
    } catch (err) {
      console.error('QR Code generation failed:', err);
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw QR code with overlay
  useEffect(() => {
    if (!qrUrl) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const qrImage = new Image();
    qrImage.onload = () => {
      // Set canvas size with extra padding for text if needed
      const extraPadding = showText ? 30 : 0;
      canvas.width = qrImage.width;
      canvas.height = qrImage.height + extraPadding;
      
      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code
      ctx.drawImage(qrImage, 0, 0);
      
      // Add logo if enabled
      if (showLogo && logoUrl) {
        const logo = new Image();
        logo.onload = () => {
          // Calculate logo size and position
          const size = (canvas.width * logoSize) / 100;
          const x = (canvas.width - size) / 2;
          const y = (canvas.height - size - (showText ? extraPadding : 0)) / 2;
          
          // Add white background behind logo for better visibility
          ctx.save();
          ctx.beginPath();
          ctx.arc(x + size/2, y + size/2, size/2 + 5, 0, Math.PI * 2, true);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.restore();
          
          // Create circular clipping path for logo
          ctx.save();
          ctx.beginPath();
          ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          
          // Draw logo
          ctx.drawImage(logo, x, y, size, size);
          
          // Add subtle border around logo
          ctx.beginPath();
          ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2, true);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        };
        logo.src = logoUrl;
      }
      
      // Add text if enabled
      if (showText && overlayText) {
        ctx.save();
        
        // Create background for text
        const textY = showText ? canvas.height - 15 : canvas.height - 10;
        const textMetrics = ctx.measureText(overlayText);
        const textWidth = textMetrics.width + 20;
        
        // Draw text background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
          (canvas.width - textWidth) / 2,
          textY - 16,
          textWidth,
          22
        );
        
        // Set text style
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        // Draw text
        ctx.fillText(overlayText, canvas.width / 2, textY);
        ctx.restore();
      }
    };
    qrImage.src = qrUrl;
  }, [qrUrl, logoUrl, showLogo, showText, overlayText, logoSize]);

  // Download QR code
  const downloadQR = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'custom-qr-code.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <Box className="p-6 max-w-4xl mx-auto">
      <Typography variant="h4" component="h1" gutterBottom>
        Custom QR Code Generator
      </Typography>
      
      <Card className="mb-6">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            1. Enter Content
          </Typography>
          
          <TextField
            fullWidth
            label="Enter text or URL"
            value={text}
            onChange={(e) => setText(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={generateQR}
            disabled={!text}
            className="mt-4"
          >
            Generate QR Code
          </Button>
        </CardContent>
      </Card>
      
      {qrUrl && (
        <>
          <Card className="mb-6">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                2. Customize QR Code
              </Typography>
              
              <Box className="mb-4">
                <FormControlLabel
                  control={
                    <Switch 
                      checked={showLogo} 
                      onChange={(e) => setShowLogo(e.target.checked)}
                    />
                  }
                  label="Add Logo"
                />
                
                {showLogo && (
                  <Box className="ml-8 mt-2">
                    <Button
                      variant="outlined"
                      component="label"
                      className="mb-2"
                    >
                      Upload Logo
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </Button>
                    
                    {logoUrl && (
                      <>
                        <Box className="mt-2 mb-2">
                          <Typography gutterBottom>Logo Size</Typography>
                          <Slider
                            value={logoSize}
                            onChange={(_, newValue) => setLogoSize(newValue as number)}
                            min={10}
                            max={50}
                            valueLabelDisplay="auto"
                          />
                        </Box>
                        <Box className="mt-2 mb-4">
                          <img 
                            src={logoUrl} 
                            alt="Logo preview" 
                            className="w-16 h-16 object-contain"
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                )}
              </Box>
              
              <Box>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={showText} 
                      onChange={(e) => setShowText(e.target.checked)}
                    />
                  }
                  label="Add Text"
                />
                
                {showText && (
                  <Box className="ml-8 mt-2">
                    <TextField
                      fullWidth
                      label="Overlay Text"
                      value={overlayText}
                      onChange={(e) => setOverlayText(e.target.value)}
                      margin="normal"
                      variant="outlined"
                    />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                3. Result
              </Typography>
              
              <Box className="flex flex-col items-center mt-4">
                <canvas ref={canvasRef} className="border border-gray-300 mb-4" />
                
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={downloadQR}
                  className="mt-2"
                >
                  Download QR Code
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default QRGenerator;
