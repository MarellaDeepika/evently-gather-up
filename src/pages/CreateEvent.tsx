
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, DollarSign, Image as ImageIcon, Save, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { eventService, CreateEventData } from "@/services/eventService";

const CreateEvent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateEventData>({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    maxAttendees: "",
    price: "",
    image: ""
  });

  const categories = ["Technology", "Workshop", "Music", "Business", "Art", "Fitness", "Food", "Sports", "Education"];

  const handleInputChange = (field: keyof CreateEventData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.category || !formData.date || !formData.time || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create event using the service
      const newEvent = eventService.createEvent(formData);
      
      toast({
        title: "Event Created Successfully!",
        description: `${formData.title} has been created and is now live.`,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        location: "",
        maxAttendees: "",
        price: "",
        image: ""
      });

      // Navigate to the events page or the new event's details
      setTimeout(() => {
        navigate('/events');
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Error Creating Event",
        description: "There was an error creating your event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Evently</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/events" className="text-gray-700 hover:text-blue-600 transition-colors">
                Browse Events
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/create-event" className="text-blue-600 font-medium">
                Create Event
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New Event</h1>
          <p className="text-xl text-gray-600">Fill in the details to create your amazing event</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Essential details about your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter event title"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your event in detail"
                      className="mt-1 min-h-[120px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time */}
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Date & Time
                  </CardTitle>
                  <CardDescription>When will your event take place?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Event Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Start Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange("time", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Location
                  </CardTitle>
                  <CardDescription>Where will your event be held?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="location">Venue Address *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Enter venue address or location"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Capacity & Pricing */}
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Capacity & Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="maxAttendees">Max Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      value={formData.maxAttendees}
                      onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                      placeholder="100"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Ticket Price (USD)</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Leave empty for free events</p>
                  </div>
                </CardContent>
              </Card>

              {/* Event Image */}
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Event Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => handleInputChange("image", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">Add a compelling image for your event</p>
                  </div>
                  
                  {formData.image && (
                    <div className="mt-4">
                      <img 
                        src={formData.image} 
                        alt="Event preview" 
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button type="submit" className="w-full h-12 text-lg rounded-xl">
                  <Save className="h-5 w-5 mr-2" />
                  Create Event
                </Button>
                <Button type="button" variant="outline" className="w-full h-12 text-lg rounded-xl" asChild>
                  <Link to="/events">Cancel</Link>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
