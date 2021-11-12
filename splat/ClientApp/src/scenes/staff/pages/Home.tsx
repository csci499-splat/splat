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
        <Grid container spacing={3} sx={{ margin: 1 }}>
            <Grid item xs={12} md={8} lg={6}>
                <Grid item xs>
                    <Widget size={widgetsList[0].size} title={widgetsList[0].title}>
                        {widgetsList[0].innerContent}
                    </Widget>
                </Grid>
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
