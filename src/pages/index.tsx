import CheckIcon from '@mui/icons-material/Check';
import {
  Alert,
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
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

const LEVELS = 10;

type Gamble = {
  bet: number;
  level: number;
  status: 'WAITING' | 'PROGRESS' | 'WON' | 'LOST';
  payoff: number;
  probability: number;
};

type State = {
  balance: number;
  stake: number;
  defaultProbability: number;
  defaultBet: number;
  isStopOn10: boolean;
  gambles: Gamble[];
  currentGamble: Gamble;
  error?: string;
};

const initialState: State = {
  balance: 0,
  stake: 0,
  isStopOn10: false,
  defaultBet: 0,
  defaultProbability: 0.5,
  gambles: [],
  currentGamble: {
    bet: 0,
    level: 0,
    probability: 0.5,
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
      type: 'SET_DEFAULT_PROBABILITY';
      payload: { defaultProbability: string };
    }
  | {
      type: 'RAISE_TO_DOUBLE';
    }
  | {
      type: 'DONE';
    }
  | {
      type: 'TOGGLE_STOP_ON_10';
    };

const getSafeNumber = (maybeNumber: string, defaultValue: number) => {
  const parsed = Number(maybeNumber);
  return isNaN(parsed) ? defaultValue : parsed;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'RECHARGE':
      return {
        ...state,
        balance: state.balance + action.payload.balance,
      };
    case 'SET_DEFAULT_BET':
      const defaultBet = getSafeNumber(action.payload.defaultBet, 0);
      return {
        ...state,
        defaultBet,
        currentGamble: {
          ...state.currentGamble,
          bet: defaultBet,
        },
      };
    case 'SET_DEFAULT_PROBABILITY':
      const defaultProbability =
        getSafeNumber(action.payload.defaultProbability.split('%')[0], 50) /
        100;

      return {
        ...state,
        defaultProbability,
        currentGamble: {
          ...state.currentGamble,
          probability: defaultProbability,
        },
      };
    case 'RAISE_TO_DOUBLE':
      if (state.balance <= 0 && state.currentGamble.level === 0) {
        return {
          ...state,
          error: "Please Recharge your bet. It's free!",
        };
      }

      if (state.currentGamble.bet <= 0 && state.currentGamble.level === 0) {
        return {
          ...state,
          error: 'Plase set your bet',
        };
      }

      if (state.currentGamble.level === 0) {
        return {
          ...state,
          balance: state.balance - state.currentGamble.bet,
          currentGamble: {
            ...state.currentGamble,
            level: state.currentGamble.level + 1,
            payoff: state.currentGamble.bet,
          },
          error: undefined,
        };
      }

      if (state.currentGamble.level < LEVELS - 1) {
        const random = Math.random();
        const probability = random >= 1 - state.currentGamble.probability;

        if (probability) {
          return {
            ...state,
            currentGamble: {
              ...state.currentGamble,
              level: state.currentGamble.level + 1,
              payoff: state.currentGamble.payoff * 2,
            },
            error: undefined,
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
            error: undefined,
          };
        }
      }

      if (state.currentGamble.level === LEVELS - 1 && state.isStopOn10) {
        return state;
      }
    // state.currentGamble.level === LEVELS - 1 && 'DONE'
    case 'DONE':
      return {
        ...state,
        balance: state.balance + state.currentGamble.payoff,
        gambles: [...state.gambles, { ...state.currentGamble, status: 'WON' }],
        currentGamble: {
          ...initialState.currentGamble,
          level: 0,
          bet: state.defaultBet,
          probability: state.defaultProbability,
        },
        error: undefined,
      };
    case 'TOGGLE_STOP_ON_10':
      return {
        ...state,
        isStopOn10: !state.isStopOn10,
      };
    default:
      return state;
  }
};

const Home: NextPage = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [defaultBet, setDefaultBet] = React.useState<string>('');
  const [defaultProbability, setDefaultProbability] =
    React.useState<string>('50%');

  React.useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'R':
        case 'r':
          dispatch({ type: 'RECHARGE', payload: { balance: 40 } });
          break;
        case 'A':
        case 'a':
          dispatch({ type: 'SET_DEFAULT_BET', payload: { defaultBet: '10' } });
          break;
        case 'Z':
        case 'z':
          dispatch({ type: 'RAISE_TO_DOUBLE' });
          break;
        case 'X':
        case 'x':
          dispatch({ type: 'DONE' });
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', eventHandler);
    return () => {
      window.removeEventListener('keydown', eventHandler);
    };
  }, []);

  const handleRecharge = React.useCallback(
    (balance: number) => dispatch({ type: 'RECHARGE', payload: { balance } }),
    []
  );

  const handleDefaultBet = React.useCallback(
    (defaultBet: string) =>
      dispatch({ type: 'SET_DEFAULT_BET', payload: { defaultBet } }),
    []
  );

  const handleDefaultProbability = React.useCallback(
    (defaultProbability: string) =>
      dispatch({
        type: 'SET_DEFAULT_PROBABILITY',
        payload: { defaultProbability },
      }),
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

  const handleToggleStopOn10 = React.useCallback(() => {
    dispatch({ type: 'TOGGLE_STOP_ON_10' });
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
          CAN YOU GET A MILLION?
        </Typography>
        <Typography>Press R to recharge $40</Typography>
        <Typography>Press A to set default bet to $10</Typography>
        <Typography>Press Z to Raise!</Typography>
        <Typography>Press X to Get the payoff.</Typography>
        {state.error && <Alert severity="error">{state.error}</Alert>}
        <Typography>Player Balance: ${state.balance}</Typography>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group">
          <Button onClick={() => handleRecharge(10)}>Recharge $10</Button>
          <Button onClick={() => handleRecharge(20)}>Recharge $20</Button>
          <Button onClick={() => handleRecharge(30)}>Recharge $30</Button>
          <Button onClick={() => handleRecharge(40)}>Recharge $40</Button>
        </ButtonGroup>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.isStopOn10}
                onClick={() => handleToggleStopOn10()}
              />
            }
            label={state.isStopOn10 ? 'STOP ON 10' : 'NOT STOP ON 10'}
          />
        </FormGroup>
        <Typography>Current Bet: ${state.defaultBet}</Typography>
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
                  aria-label="set default bet"
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
        <Typography>
          Current Probability: {state.defaultProbability * 100} %
        </Typography>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Set default probability
          </InputLabel>
          <OutlinedInput
            id="set-default-probability"
            value={defaultProbability}
            onChange={({ target: { value } }) => {
              setDefaultProbability(value);
            }}
            onKeyDown={({ key }) => {
              if (key === 'Enter') {
                handleDefaultProbability(defaultProbability);
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="set default probability"
                  edge="end"
                  onMouseDown={handleMouseDown}
                  onClick={() => {
                    handleDefaultProbability(defaultProbability);
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
                      <Typography>${state.currentGamble.payoff}</Typography>
                    )}
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleRaise();
                      }}
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
