import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, UserCheck, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: January 2025
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Overview */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-purple-600" />
                Privacy Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                We respect your privacy. Your data is only used for login and profile customization. 
                We don't share or sell your personal information to third parties.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-cyan-500" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Account Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Email address (required for account creation)</li>
                  <li>• First and last name</li>
                  <li>• Phone number (optional)</li>
                  <li>• Profile avatar selection</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Gaming Data</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Game scores and statistics</li>
                  <li>• Game preferences and settings</li>
                  <li>• Progress and achievements</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Technical Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Browser type and version</li>
                  <li>• Device information</li>
                  <li>• IP address and location data</li>
                  <li>• Usage analytics and performance metrics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-green-500" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Core Services</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Creating and managing your gaming account</li>
                  <li>• Personalizing your gaming experience</li>
                  <li>• Saving your game progress and scores</li>
                  <li>• Providing customer support</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Improvement & Analytics</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Analyzing usage patterns to improve our games</li>
                  <li>• Fixing bugs and technical issues</li>
                  <li>• Developing new features and games</li>
                  <li>• Ensuring security and preventing fraud</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-orange-500" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Encryption of data in transit and at rest</li>
                <li>• Secure authentication through Firebase</li>
                <li>• Regular security audits and updates</li>
                <li>• Limited access to personal data by authorized personnel only</li>
                <li>• Secure hosting infrastructure with automated backups</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-red-500" />
                Data Sharing & Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  We DO NOT sell your personal information.
                </p>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Your data is never sold, rented, or shared with third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Limited Sharing</h3>
                <p className="text-muted-foreground mb-2">
                  We may share information only in these specific circumstances:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• With your explicit consent</li>
                  <li>• To comply with legal obligations or court orders</li>
                  <li>• To protect our rights, privacy, safety, or property</li>
                  <li>• With service providers who help operate our platform (under strict confidentiality agreements)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-blue-500" />
                Your Rights & Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">You have the following rights regarding your personal data:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Access:</strong> Request a copy of your personal data</li>
                <li>• <strong>Update:</strong> Correct or update your profile information</li>
                <li>• <strong>Delete:</strong> Request deletion of your account and data</li>
                <li>• <strong>Portability:</strong> Export your data in a standard format</li>
                <li>• <strong>Opt-out:</strong> Unsubscribe from promotional communications</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-purple-600" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><strong>Email:</strong> privacy@gamehub.com</p>
                <p><strong>Developer:</strong> Rohit Kumar</p>
                <p><strong>Response Time:</strong> We aim to respond within 48 hours</p>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. When we do, we will post the updated policy 
                on this page and update the "Last updated" date. We encourage you to review this policy periodically 
                to stay informed about how we protect your information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
