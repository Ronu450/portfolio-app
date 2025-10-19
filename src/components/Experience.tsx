import { useState } from 'react';
import { Briefcase, Plus, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: '1',
      title: 'Senior Developer',
      company: 'Tech Company',
      period: '2022 - Present',
      description: 'Leading development of web applications and mentoring junior developers.',
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'Startup Inc',
      period: '2020 - 2022',
      description: 'Built and maintained multiple client projects using modern web technologies.',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    period: '',
    description: '',
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ title: '', company: '', period: '', description: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (exp: ExperienceItem) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      company: exp.company,
      period: exp.period,
      description: exp.description,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setExperiences(experiences.map(exp => 
        exp.id === editingId ? { ...exp, ...formData } : exp
      ));
    } else {
      setExperiences([
        ...experiences,
        { id: Date.now().toString(), ...formData },
      ]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="mb-2 text-primary">Work Experience</h2>
            <p className="text-muted-foreground">My professional journey</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit' : 'Add'} Experience</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Developer"
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Tech Company"
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="e.g. 2022 - Present"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your role and achievements"
                    rows={4}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingId ? 'Update' : 'Add'} Experience
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {experiences.map((exp) => (
            <Card key={exp.id} className="border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{exp.title}</CardTitle>
                      <p className="text-muted-foreground mt-1">{exp.company}</p>
                      <p className="text-muted-foreground mt-1">{exp.period}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(exp)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
