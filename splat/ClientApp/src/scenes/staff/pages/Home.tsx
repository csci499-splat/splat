import { Grid } from '@mui/material';
import React, { FC, ReactElement } from 'react';

import { widgetsList } from '../widgets/widgetsList';
import { IStaffChild } from '../Staff';
import Widget from '../widgets/Widget';

interface HomeProps extends IStaffChild {
    
}

const Home: FC<HomeProps> = (props: HomeProps): ReactElement => {

    return (
        <>
        <Grid container spacing={2} sx={{ margin: 1, marginRight: 0, width: '100%' }} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <Widget size={widgetsList[0].size} title={widgetsList[0].title}>
                    {widgetsList[0].innerContent}
                </Widget>
            </Grid>
            { widgetsList.slice(1).map((item, index) => (
            <Grid key={index} item xs>
                <Widget size={item.size} title={item.title}>
                    {item.innerContent}
                </Widget>
            </Grid>
            ))}
        </Grid>
        </>
    )
};

export default Home;
