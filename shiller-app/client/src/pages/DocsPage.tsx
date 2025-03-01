import React from 'react';

const DocsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#97ef83] mb-8">Shillster Documentation</h1>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#fbfcff] mb-4">Overview</h2>
        <p className="text-[#a8aab0] mb-4">
          Shillster is a decentralized social marketing platform specifically designed for the Solana ecosystem. 
          We connect memecoin projects with influential users (Shillers) who can promote Solana tokens to their followers. 
          The platform facilitates authentic word-of-mouth marketing for Solana memecoins by rewarding users for 
          successful promotions and engagements.
        </p>
        <div className="bg-[#24272e] border border-[#282b33] rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-[#97ef83] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-[#97ef83] font-medium">Why Solana?</span>
          </div>
          <p className="text-[#a8aab0] text-sm">
            Solana's high throughput, low transaction costs, and vibrant memecoin ecosystem make it the perfect 
            blockchain for our platform. With transaction speeds of up to 65,000 TPS and costs as low as $0.00025 per 
            transaction, Shillster can operate efficiently while providing the best experience for both token creators 
            and promoters.
          </p>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#fbfcff] mb-4">User Roles</h2>
        <div className="bg-[#24272e] border border-[#282b33] rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-[#97ef83] mb-3">Regular Users</h3>
          <p className="text-[#a8aab0] mb-2">As a regular user, you can:</p>
          <ul className="list-disc pl-6 text-[#a8aab0] space-y-1">
            <li>Follow Shillers to see their content</li>
            <li>View shills and engage with content</li>
            <li>Apply to become a Shiller</li>
            <li>Manage your profile and connections</li>
          </ul>
        </div>
        
        <div className="bg-[#24272e] border border-[#282b33] rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#97ef83] mb-3">Shillers</h3>
          <p className="text-[#a8aab0] mb-2">As a verified Shiller, you can:</p>
          <ul className="list-disc pl-6 text-[#a8aab0] space-y-1">
            <li>Create and complete shills</li>
            <li>Earn rewards based on performance</li>
            <li>Build a following of users</li>
            <li>Access advanced analytics and insights</li>
          </ul>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#fbfcff] mb-4">Registration and Authentication</h2>
        <div className="bg-[#24272e] border border-[#282b33] rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#97ef83] mb-3">How to Register</h3>
          <ol className="list-decimal pl-6 text-[#a8aab0] space-y-2">
            <li>Click the "Register" button in the navigation bar</li>
            <li>Enter your desired username/handle (this will be your unique identifier)</li>
            <li>Provide your email address</li>
            <li>Create a secure password</li>
            <li>Enter your wallet address (for receiving payments)</li>
            <li>Agree to the platform terms and conditions</li>
            <li>Complete the registration process</li>
          </ol>
          
          <h3 className="text-xl font-bold text-[#97ef83] mt-6 mb-3">Login Process</h3>
          <ol className="list-decimal pl-6 text-[#a8aab0] space-y-2">
            <li>Click the "Login" button in the navigation bar</li>
            <li>Enter your username/handle or email</li>
            <li>Enter your password</li>
            <li>Click "Login" to access your account</li>
          </ol>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#fbfcff] mb-4">Becoming a Shiller</h2>
        <div className="bg-[#24272e] border border-[#282b33] rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#97ef83] mb-3">Application Process</h3>
          <p className="text-[#a8aab0] mb-4">
            To become a Shiller, you need to meet certain criteria and go through a verification process:
          </p>
          
          <h4 className="text-lg font-semibold text-[#fbfcff] mb-2">Requirements:</h4>
          <ul className="list-disc pl-6 text-[#a8aab0] space-y-1 mb-4">
            <li>Minimum follower count (platform-defined threshold)</li>
            <li>Verification of identity</li>
            <li>Agreement to platform terms and conditions</li>
            <li>Completed profile with all required information</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-[#fbfcff] mb-2">Verification Process:</h4>
          <ol className="list-decimal pl-6 text-[#a8aab0] space-y-2">
            <li>Submit your application through your profile settings</li>
            <li>Platform administrators review your application</li>
            <li>You may be asked to provide additional verification</li>
            <li>Once approved, you gain access to Shiller-specific features</li>
          </ol>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#fbfcff] mb-4">Creating and Completing Shills</h2>
        <div className="bg-[#24272e] border border-[#282b33] rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#97ef83] mb-3">Creating a Shill</h3>
          <p className="text-[#a8aab0] mb-2">As a verified Shiller, you can create new shills:</p>
          <ol className="list-decimal pl-6 text-[#a8aab0] space-y-2 mb-6">
            <li>Click the "Create Shill" button on your dashboard</li>
            <li>Define the shill content (text, images, links)</li>
            <li>Set reward parameters</li>
            <li>Specify target audience and requirements</li>
            <li>Submit for approval</li>
          </ol>
          
          <h3 className="text-xl font-bold text-[#97ef83] mb-3">Shill Lifecycle</h3>
          <ol className="list-decimal pl-6 text-[#a8aab0] space-y-2">
            <li><strong>Creation:</strong> Shiller creates a new shill</li>
            <li><strong>Approval:</strong> Platform reviews and approves the shill</li>
            <li><strong>Active:</strong> Shill becomes available for completion</li>
            <li><strong>Completion:</strong> Shiller completes the required actions</li>
            <li><strong>Verification:</strong> Platform verifies completion</li>
            <li><strong>Reward:</strong> Payment is processed based on performance</li>
          </ol>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#fbfcff] mb-4">Reward System</h2>
        <div className="bg-[#24272e] border border-[#282b33] rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#97ef83] mb-3">Payment Structure</h3>
          <p className="text-[#a8aab0] mb-2">Shillers earn rewards based on:</p>
          <ul className="list-disc pl-6 text-[#a8aab0] space-y-1 mb-6">
            <li><strong>Base Rate:</strong> Fixed payment for completing a shill</li>
            <li><strong>Performance Bonuses:</strong>
              <ul className="list-disc pl-6 text-[#a8aab0] space-y-1 mt-1">
                <li>Engagement rate (likes, comments, shares)</li>
                <li>Click-through rate</li>
                <li>Conversion rate</li>
                <li>Follower count and quality</li>
              </ul>
            </li>
          </ul>
          
          <h3 className="text-xl font-bold text-[#97ef83] mb-3">Payment Methods</h3>
          <ul className="list-disc pl-6 text-[#a8aab0] space-y-1">
            <li>Cryptocurrency payments (primary method)</li>
            <li>Points system that can be converted to cryptocurrency</li>
            <li>Potential for fiat currency options in the future</li>
          </ul>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#fbfcff] mb-4">Social Features</h2>
        <div className="bg-[#24272e] border border-[#282b33] rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#97ef83] mb-3">Following System</h3>
          <ul className="list-disc pl-6 text-[#a8aab0] space-y-1 mb-6">
            <li>Users can follow Shillers to see their content</li>
            <li>Follow requests may require approval</li>
            <li>Followers receive notifications about new shills</li>
          </ul>
          
          <h3 className="text-xl font-bold text-[#97ef83] mb-3">Engagement</h3>
          <p className="text-[#a8aab0] mb-2">Users can interact with shills through:</p>
          <ul className="list-disc pl-6 text-[#a8aab0] space-y-1">
            <li>Likes</li>
            <li>Comments</li>
            <li>Shares</li>
            <li>Direct messages</li>
          </ul>
        </div>
      </section>
      
      <div className="bg-[#24272e] border border-[#282b33] rounded-lg p-6 mt-12">
        <h2 className="text-xl font-bold text-[#97ef83] mb-3">Need Help?</h2>
        <p className="text-[#a8aab0] mb-4">
          If you have any questions or need assistance, please contact our support team at 
          <a href="mailto:support@shillster.app" className="text-[#97ef83] ml-1 hover:underline">
            support@shillster.app
          </a>
        </p>
        <p className="text-[#a8aab0]">
          Follow us on Twitter: 
          <a 
            href="https://x.com/shillsterdotapp" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#97ef83] ml-1 hover:underline"
          >
            @shillsterdotapp
          </a>
        </p>
      </div>
    </div>
  );
};

export default DocsPage;
