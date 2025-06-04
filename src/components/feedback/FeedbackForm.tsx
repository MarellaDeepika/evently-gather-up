
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeedbackFormProps {
  eventId: number;
  ticketId: string;
}

const FeedbackForm = ({ eventId, ticketId }: FeedbackFormProps) => {
  const [rating, setRating] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !feedback.trim()) {
      toast({
        title: "Please complete all fields",
        description: "Rating and feedback are required.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store feedback in localStorage for now
    const feedbackData = {
      eventId,
      ticketId,
      rating: parseInt(rating),
      feedback,
      submittedAt: new Date().toISOString()
    };
    
    const existingFeedback = JSON.parse(localStorage.getItem('event_feedback') || '[]');
    existingFeedback.push(feedbackData);
    localStorage.setItem('event_feedback', JSON.stringify(existingFeedback));
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    toast({
      title: "Thank you for your feedback!",
      description: "Your review helps us improve future events.",
    });
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="flex justify-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`h-5 w-5 ${star <= parseInt(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        <p className="text-green-600 font-medium">Feedback submitted successfully!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-base font-medium">Rate your experience</Label>
        <RadioGroup value={rating} onValueChange={setRating} className="flex space-x-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="flex items-center space-x-1">
              <RadioGroupItem value={star.toString()} id={`star-${star}`} />
              <Label htmlFor={`star-${star}`} className="flex items-center cursor-pointer">
                <Star className="h-4 w-4" />
                <span className="ml-1">{star}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="feedback">Share your experience</Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us about your experience at this event..."
          className="mt-1"
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
};

export default FeedbackForm;
