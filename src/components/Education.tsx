import { useState } from 'react';
import { GraduationCap, Plus, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export function Education() {
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: '1',
      degree: 'Bachelor of Computer Science',
      institution: 'University Name',
      period: '2016 - 2020',
      description: 'Focused on software engineering and web development. Graduated with honors.',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    period: '',
    description: '',
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ degree: '', institution: '', period: '', description: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (edu: EducationItem) => {
    setEditingId(edu.id);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      period: edu.period,
      description: edu.description,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setEducations(educations.map(edu => 
        edu.id === editingId ? { ...edu, ...formData } : edu
      ));
    } else {
      setEducations([
        ...educations,
        { id: Date.now().toString(), ...formData },
      ]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setEducations(educations.filter(edu => edu.id !== id));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="mb-2 text-accent">Education</h2>
            <p className="text-muted-foreground">My academic background</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit' : 'Add'} Education</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="e.g. Bachelor of Computer Science"
                  />
                </div>
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. University Name"
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Input
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="e.g. 2016 - 2020"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your studies and achievements"
                    rows={4}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingId ? 'Update' : 'Add'} Education
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {educations.map((edu) => (
            <Card key={edu.id} className="border-accent/20 hover:shadow-lg hover:shadow-accent/10 transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center flex-shrink-0 shadow-md">
                      <GraduationCap className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle>{edu.degree}</CardTitle>
                      <p className="text-muted-foreground mt-1">{edu.institution}</p>
                      <p className="text-muted-foreground mt-1">{edu.period}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(edu)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(edu.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{edu.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
