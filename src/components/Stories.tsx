import { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

interface Story {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
}

export function Stories() {
  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      title: 'My Journey into Web Development',
      date: '2024-01-15',
      category: 'Career',
      content: 'It all started when I built my first website. The excitement of seeing my code come to life on the screen was indescribable. From that moment, I knew I wanted to pursue a career in web development...',
    },
    {
      id: '2',
      title: 'Lessons Learned from My First Big Project',
      date: '2024-02-20',
      category: 'Learning',
      content: 'Working on my first major project taught me invaluable lessons about planning, communication, and perseverance. Here are some key takeaways that shaped my approach to development...',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: '',
    content: '',
  });

  const handleAdd = () => {
    setEditingId(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({ title: '', date: today, category: '', content: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (story: Story) => {
    setEditingId(story.id);
    setFormData({
      title: story.title,
      date: story.date,
      category: story.category,
      content: story.content,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setStories(stories.map(story => 
        story.id === editingId ? { ...story, ...formData } : story
      ));
    } else {
      setStories([
        { id: Date.now().toString(), ...formData },
        ...stories,
      ]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setStories(stories.filter(story => story.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="mb-2 text-secondary">My Stories</h2>
            <p className="text-muted-foreground">Thoughts, experiences, and insights</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Story
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit' : 'Add'} Story</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Give your story a title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Career, Learning"
                    />
                  </div>
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your story here..."
                    rows={8}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingId ? 'Update' : 'Publish'} Story
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {stories.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No stories yet. Click "Add Story" to share your first story!</p>
              </CardContent>
            </Card>
          ) : (
            stories.map((story) => (
              <Card key={story.id} className="border-secondary/20 hover:shadow-lg hover:shadow-secondary/10 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                          <BookOpen className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle>{story.title}</CardTitle>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(story.date)}</span>
                            </div>
                            {story.category && (
                              <Badge variant="secondary">{story.category}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(story)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(story.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{story.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
