import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Box, Card, CardContent, Button, TextField, Modal } from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller } from 'react-hook-form';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string | null;
  timestamp: bigint;
}

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(https://loremflickr.com/g/1200/400/cryptocurrency?lock=1)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8),
  marginBottom: theme.spacing(4),
}));

const FloatingActionButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
}));

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getRecentPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (data: { title: string; body: string; author: string }) => {
    try {
      await backend.createPost(data.title, data.body, data.author ? [data.author] : []);
      setIsModalOpen(false);
      reset();
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Box>
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        <Typography variant="h5">
          Stay updated with the latest in cryptocurrency
        </Typography>
      </HeroSection>

      <Container>
        {posts.map((post) => (
          <Card key={post.id.toString()} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {post.body}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {post.author ? `By ${post.author}` : 'Anonymous'} | 
                {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}

        <FloatingActionButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          New Post
        </FloatingActionButton>

        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="modal-title"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
              Create New Post
            </Typography>
            <form onSubmit={handleSubmit(handleCreatePost)}>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: 'Title is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="body"
                control={control}
                defaultValue=""
                rules={{ required: 'Body is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Body"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="author"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Author (optional)"
                    fullWidth
                    margin="normal"
                  />
                )}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Submit
              </Button>
            </form>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default App;
