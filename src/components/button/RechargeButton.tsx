import * as React from 'react';
import { Button } from '@mui/material';

interface RechargeButtonProps {
  balance: number;
  handleRecharge: (balance: number) => void;
}

const RechargeButton = ({ balance, handleRecharge }: RechargeButtonProps) => {
  return (
    <Button onClick={handleRecharge.bind(null, balance)}>
      Recharge ${balance}
    </Button>
  );
};
export default RechargeButton;
