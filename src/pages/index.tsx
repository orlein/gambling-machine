import CheckIcon from '@mui/icons-material/Check';
import {
  Button,
  ButtonGroup,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
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
  currentGamble: Gamble;
};

const initialState: State = {
  balance: 0,
  stake: 0,
  defaultBet: 0,
  gambles: [],
  currentGamble: {
    bet: 0,
    level: 0,
    status: 'WAITING',
    payoff: 0,
  },
};

type Action =
  | {
      type: 'RECHARGE';
      payload: Pick<State, 'balance'>;
    }
  | {
      type: 'SET_DEFAULT_BET';
      payload: { defaultBet: string };
    }
  | {
      type: 'RAISE_TO_DOUBLE';
    }
  | {
      type: 'DONE';
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'RECHARGE':
      return {
        ...state,
        balance: state.balance + action.payload.balance,
      };
    case 'SET_DEFAULT_BET':
      const defaultBet = Number(action.payload.defaultBet);
      return {
        ...state,
        defaultBet: isNaN(defaultBet) ? 0 : defaultBet,
        currentGamble: {
          ...state.currentGamble,
          bet: defaultBet,
        },
      };
    case 'RAISE_TO_DOUBLE':
      if (state.currentGamble.level === 0) {
        return {
          ...state,
          balance: state.balance - state.currentGamble.bet,
          currentGamble: {
            ...state.currentGamble,
            level: state.currentGamble.level + 1,
            payoff: state.currentGamble.bet,
          },
        };
      }
      const halfProbability = Math.random() >= 0.5;
      if (halfProbability) {
        return {
          ...state,
          currentGamble: {
            ...state.currentGamble,
            level: state.currentGamble.level + 1,
            payoff: state.currentGamble.payoff * 2,
          },
        };
      } else {
        return {
          ...state,
          gambles: [
            ...state.gambles,
            { ...state.currentGamble, payoff: 0, status: 'LOST' },
          ],
          currentGamble: {
            ...initialState.currentGamble,
            bet: state.defaultBet,
          },
        };
      }
    case 'DONE':
      return {
        ...state,
        balance: state.balance + state.currentGamble.payoff,
        gambles: [...state.gambles, { ...state.currentGamble, status: 'WON' }],
        currentGamble: {
          ...initialState.currentGamble,
          bet: state.defaultBet,
        },
      };
    default:
      return state;
  }
};

const LEVELS = 10;

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

  const handleRaise = React.useCallback(() => {
    dispatch({ type: 'RAISE_TO_DOUBLE' });
  }, []);

  const handleDone = React.useCallback(() => {
    dispatch({ type: 'DONE' });
  }, []);

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

        <Stepper activeStep={state.currentGamble.level} orientation="vertical">
          {LEVELS_ARRAY.map((step, index) => (
            <Step key={index}>
              <StepLabel>{'Step'}</StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  <div>
                    {index !== 0 && (
                      <Typography>{state.currentGamble.payoff}</Typography>
                    )}
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleRaise}
                      sx={{ mt: 1, mr: 1 }}>
                      {index === 0
                        ? 'START'
                        : index === LEVELS_ARRAY.length - 1
                        ? 'Pay off'
                        : 'Raise'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleDone}
                      sx={{ mt: 1, mr: 1 }}>
                      Done
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Copyright />
      </Box>
    </Container>
  );
};

export default Home;
