import { toast } from 'react-toastify';
import { warningToast } from '../utils/toastStyles';

interface RewardsSectionProps {
  userRole: 'user' | 'shiller';
}

const RewardsSection = ({ userRole }: RewardsSectionProps) => {
  const handleClaimRewards = () => {
    if (userRole === 'user') {
      warningToast('Must be an approved shiller to claim rewards');
    } else {
      warningToast('Rewards currently not available');
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-[#97ef83] rounded-full mr-2"></div>
        <h2 className="text-[#97ef83] font-bold uppercase tracking-wider">claim_rewards</h2>
      </div>
      
      <div className="bg-[#24272e] border border-[#282b33] p-6 rounded-lg flex items-center justify-center">
        <button 
          className="bg-[#97ef83] hover:bg-[#97ef83]/90 text-[#1b1d22] font-bold py-2 px-6 rounded-md transition-colors duration-200"
          onClick={handleClaimRewards}
        >
          Claim Rewards
        </button>
      </div>
    </div>
  );
};

export default RewardsSection;
