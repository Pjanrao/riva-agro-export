"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type EnquiryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void; // ✅ ADD THIS
  product: {
    id: string;
    name: string;
    category?: string;
  };
};

export default function EnquiryModal({
  open,
  onOpenChange,
  product,
}: EnquiryModalProps) {
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: "",
    message: "",
  });

  const handleSubmit = async () => {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        category: product.category,
        ...form,
      }),
    });

    if (res.ok) {
      toast({
        title: "Enquiry sent",
        description: "Our team will contact you shortly.",
      });
    onOpenChange(false); 
      setForm({
        name: "",
        email: "",
        phone: "",
        quantity: "",
        message: "",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Unable to send enquiry.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Product Enquiry</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input value={product.name} disabled />
          <Input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          <Input
            placeholder="Phone / WhatsApp"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
          <Input
            placeholder="Required Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />
          <Textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />

          <Button className="w-full" onClick={handleSubmit}>
            Send Enquiry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
