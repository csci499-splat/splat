import { render, fireEvent, screen } from '@testing-library/react';
import Landing from './Landing';
import { BrowserRouter } from 'react-router-dom';

test('landing page shows correct button when logged in', () => {
    render( <BrowserRouter>
            <Landing loggedIn={true} setLoggedIn={(loggedIn: boolean) => {}} />
            </BrowserRouter>);

    screen.getByText('Begin your request', {exact: false});
})