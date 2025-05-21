"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUploadThing } from "~/utils/uploadthing";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

const formSchema = z.object({
  imageName: z
    .string()
    .min(1, {
      message: "Image name is required.",
    })
    .max(50),
});

export function UploadDialog({ onImageUpload }: { onImageUpload?: (imageUrl: string) => void }) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageName: "",
    },
  });

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedImageName(file.name);
        setSelectedImageUrl(URL.createObjectURL(file));
        // Set the image name in the form
        form.setValue("imageName", file.name);
      } else {
        setSelectedImageUrl(null);
        toast.error(<span className="text-lg">Please select an image file</span>);
      }
    } else {
      setSelectedImageName(null);
      setSelectedImageUrl(null);
    }
  };

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      toast(
        <div className="flex items-center gap-2">
          <span className="text-lg">Uploading...</span>
        </div>,
        {
          duration: 100000,
          id: "upload-begin",
        },
      );
    },
    onUploadError: (error) => {
      console.error('Upload error:', error);
      toast.dismiss("upload-begin");
      toast.error(<span className="text-lg">Upload Error: {error.message}</span>);
    },
    onClientUploadComplete: (res) => {
      console.log('Upload complete:', res);
      toast.dismiss("upload-begin");
      if (res?.[0]?.url) {
        toast.success(<span className="text-lg">Upload Complete!</span>);
        onImageUpload?.(res[0].url);
        setOpen(false);
      } else {
        toast.error(<span className="text-lg">No URL returned from upload</span>);
      }
    },
  });

  const handleImageUpload = async () => {
    if (!inputRef.current?.files?.length) {
      toast.warning(<span className="text-lg">No file selected</span>);
      return;
    }

    const selectedImage = Array.from(inputRef.current.files);
    try {
      await startUpload(selectedImage);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(<span className="text-lg">Failed to upload image</span>);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!inputRef.current?.files?.length) {
      toast.warning(<span className="text-lg">Please select an image first</span>);
      return;
    }

    try {
      await startUpload(Array.from(inputRef.current.files));
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(<span className="text-lg">Failed to upload image</span>);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload Image</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Bouquet Image</DialogTitle>
          <DialogDescription>
            Upload an image for your bouquet. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* Upload Button */}
        <div className="flex flex-col gap-2">
          {selectedImageUrl && (
            <div className="relative w-full aspect-video">
              <img
                src={selectedImageUrl}
                alt="Selected bouquet"
                className="w-full h-full rounded-md object-cover"
              />
            </div>
          )}
          <div className="item-center flex gap-2">
            <Button variant="outline" onClick={() => inputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </Button>
            <input
              type="file"
              ref={inputRef}
              className="sr-only"
              accept="image/*"
              onChange={handleImageSelect}
            />
            {selectedImageName && (
              <div className="text-sm text-gray-500">Selected: {selectedImageName}</div>
            )}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="imageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={!selectedImageUrl}>
                Upload Image
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
