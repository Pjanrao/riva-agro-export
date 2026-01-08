"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  const form = e.currentTarget;

  const res = await fetch("/api/contact", {
    method: "POST",
    body: new FormData(form),
  });

  if (res.ok) {
    setSuccess("Your message has been sent successfully.");
    form.reset(); // ✅ SAFE
  } else {
    setSuccess("Something went wrong. Please try again.");
  }
};

  return (
    <div className="container py-16">
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold">Contact Us</h2>
        <p className="mt-4 text-muted-foreground">
          We'd love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="name" placeholder="Your Name" required />
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  required
                />
              </div>
              <Input name="subject" placeholder="Subject" />
              <Textarea
                name="message"
                placeholder="Your Message"
                rows={6}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
              {success && (
                <p className="text-sm text-center text-green-600">
                  {success}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

               <div className="space-y-6">
           <h2 className="text-center font-headline text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
Contact Information</h2>
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-md">
                    <MapPin className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold">Our Address</h3>
                    <p className="text-muted-foreground">Lorem Ipsum Industrial Area, Dolor Sit Road, Amet City – 400001, India</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-md">
                    <Mail className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">info@rivaagroexports.com</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-md">
                    <Phone className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-muted-foreground">+91 8000028181 / +91 9687725260 </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
