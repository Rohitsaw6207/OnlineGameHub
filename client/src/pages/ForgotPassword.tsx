import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { resetPassword } from "../lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, Gamepad2, CheckCircle } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      setEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    form.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl mb-4">
            <Gamepad2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-mono bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            Online Game Hub
          </h1>
        </div>

        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {emailSent ? "Check Your Email" : "Reset Password"}
            </CardTitle>
            <p className="text-muted-foreground">
              {emailSent 
                ? "We've sent you a password reset link" 
                : "Enter your email to receive a reset link"
              }
            </p>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-medium text-foreground">
                    {form.getValues("email")}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Check your email and click the link to reset your password.</p>
                  <p>If you don't see the email, check your spam folder.</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    className="w-full border-border hover:bg-muted"
                  >
                    Try Another Email
                  </Button>
                  
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter your email address"
                                className="pl-10"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 text-center">
                  <Link href="/login">
                    <Button variant="link" className="text-cyan-500 hover:text-purple-600">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Button>
                  </Link>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/signup">
                      <span className="text-cyan-500 hover:text-purple-600 font-medium cursor-pointer">
                        Sign up
                      </span>
                    </Link>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
