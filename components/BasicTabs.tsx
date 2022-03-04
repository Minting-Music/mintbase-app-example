import * as React from 'react';
import PropTypes from 'prop-types';
import {Tabs, Tab, Box, Typography } from '@material-ui/core';
import Products from '../components/Products'
import { useWallet } from '../services/providers/MintbaseWalletContext'
import Collectibles from '../components/Collectibles'

function TabPanel(props: { [x: string]: any; children: any; value: any; index: any; }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0.5}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };

  const { wallet, isConnected } = useWallet()
  return (
    <Box sx={{ width: '100%'}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
        <Tabs variant="fullWidth" TabIndicatorProps={{style: {background:'#231F20'}}} value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="MarketPlace" {...a11yProps(0)} />
          <Tab label="Your Owned" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Products storeId={process.env.STOREID!} />
      </TabPanel>
      <TabPanel value={value} index={1}>
      {isConnected ? 
      <Collectibles ownerId={wallet?.activeAccount?.accountId!}/>
      :
      
      <div className="w-full px-6 py-12 bg-gray-100 border-t">
      <div className="text-xl text-center font-semibold tracking-widest uppercase text-gray-500 title-font md:text-4xl px-6 py-11">
        Login using your NEAR wallet</div> 
      </div>
        }
      
      </TabPanel>
    </Box>
  );
}
