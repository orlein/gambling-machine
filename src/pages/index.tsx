import { Timeline } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import {
  Button,
  ButtonGroup,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  NoSsr,
  OutlinedInput,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import * as React from 'react';
import Copyright from '../components/Copyright';

type Gamble = {
  bet: number;
  level: number;
  status: 'WAITING' | 'PROGRESS' | 'WON' | 'LOST';
  payoff: number;
};

type State = {
  balance: number;
  stake: number;
  defaultBet: number;
  gambles: Gamble[];
};

const initialState: State = {
  balance: 0,
  stake: 0,
  defaultBet: 0,
  gambles: [],
};

type Action =
  | {
      type: 'RECHARGE';
      payload: Pick<State, 'balance'>;
    }
  | {
      type: 'SET_DEFAULT_BET';
      payload: { defaultBet: string };
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'RECHARGE':
      return {
        ...state,
        balance: state.balance + action.payload.balance,
      };
    case 'SET_DEFAULT_BET':
      return {
        ...state,
        defaultBet: isNaN(Number(action.payload.defaultBet))
          ? 0
          : Number(action.payload.defaultBet),
      };
    default:
      return state;
  }
};

const LEVELS = 10;

const steps = [
  {
    label: 'Select campaign settings',
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: 'Create an ad group',
    description:
      'An ad group contains one or more ads which target a shared set of keywords.',
  },
  {
    label: 'Create an ad',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

const Home: NextPage = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [defaultBet, setDefaultBet] = React.useState<string>('');

  const handleRecharge = React.useCallback(
    (balance: number) => dispatch({ type: 'RECHARGE', payload: { balance } }),
    []
  );

  const handleDefaultBet = React.useCallback(
    (defaultBet: string) =>
      dispatch({ type: 'SET_DEFAULT_BET', payload: { defaultBet } }),
    []
  );

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    []
  );

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const LEVELS_ARRAY = React.useMemo(() => [...new Array(LEVELS)], []);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          '& > :not(style)': { m: 1 },
        }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gambling Machine
        </Typography>
        <Typography>Player Balance: ${state.balance}</Typography>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group">
          <Button onClick={() => handleRecharge(10)}>Recharge $10</Button>
          <Button onClick={() => handleRecharge(20)}>Recharge $20</Button>
          <Button onClick={() => handleRecharge(30)}>Recharge $30</Button>
          <Button onClick={() => handleRecharge(40)}>Recharge $40</Button>
        </ButtonGroup>
        <Typography>Current Bet: {state.defaultBet}</Typography>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Set default bet
          </InputLabel>
          <OutlinedInput
            id="set-default-bet"
            value={defaultBet}
            onChange={({ target: { value } }) => {
              setDefaultBet(value);
            }}
            onKeyDown={({ key }) => {
              if (key === 'Enter') {
                handleDefaultBet(defaultBet);
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                  onMouseDown={handleMouseDown}
                  onClick={() => {
                    handleDefaultBet(defaultBet);
                  }}>
                  <CheckIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Set default bet"
          />
        </FormControl>

        <Copyright />
      </Box>
    </Container>
  );
};

export default Home;
