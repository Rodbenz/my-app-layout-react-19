import React from 'react';
import { Socket, io } from 'socket.io-client';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, Badge, Chip } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

interface Message {
  id: string;
  content?: string;
  active_name?: string;
  timestamp: string;
  status?: string;
  // Add other fields as needed
}

export default function Dashboard() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Connect to the socket server
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
    });
    console.log('Connecting to socket server...');

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
      setLoading(false);
    });

    newSocket.on('connect_error', (error:any) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      setLoading(false);
    });

    setSocket(newSocket);

    // Listen for new messages
    newSocket.on('activeData', (data: Message) => {
      console.log('New record from DB:', data);
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      console.log('Disconnecting socket');
      newSocket.disconnect();
    };
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="mb-6">
        <Typography variant="h4" component="h1" gutterBottom>
          Real-time Dashboard
        </Typography>
        <Box display="flex" alignItems="center" mb={3}>
          <Chip
            label={isConnected ? 'Connected' : 'Disconnected'}
            color={isConnected ? 'success' : 'error'}
            size="small"
            className="mr-3"
          />
          <Typography variant="body2" color="textSecondary">
            {messages.length} messages received
          </Typography>
        </Box>
      </div>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {messages.length === 0 ? (
            <Card className="bg-gray-50 border border-gray-200">
              <CardContent className="text-center py-12">
                <NotificationsActiveIcon className="text-gray-400 text-5xl mb-4" />
                <Typography variant="h6" color="textSecondary">
                  No messages yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Waiting for real-time data to arrive...
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {messages.map((message, index) => (
                <Grid item xs={12} md={6} lg={4} key={message.id || index}>
                  <Card className="hover:shadow-md transition-shadow duration-300 h-full">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" component="h2" noWrap>
                          {message.active_name || `Message #${index + 1}`}
                        </Typography>
                        <Chip
                          label={message.status || 'New'}
                          size="small"
                          color={getStatusColor(message.status) as any}
                        />
                      </Box>

                      <Typography variant="body2" color="textSecondary" paragraph className="mb-4">
                        {message.content || 'No content provided'}
                      </Typography>

                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <Box display="flex" alignItems="center">
                          <AccessTimeIcon fontSize="small" className="text-gray-500 mr-1" />
                          <Typography variant="caption" color="textSecondary">
                            {formatTimestamp(message.timestamp)}
                          </Typography>
                        </Box>

                        {message.active_name && (
                          <Box display="flex" alignItems="center">
                            <PersonIcon fontSize="small" className="text-gray-500 mr-1" />
                            <Typography variant="caption" color="textSecondary">
                              {message.active_name}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </div>
  );
}