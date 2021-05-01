import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../utils/apolloClients"
import 'tailwindcss/tailwind.css'
import '../styles/index.css'
import { UserProvider } from "@auth0/nextjs-auth0";

export default function App({ Component, pageProps}) {
    const apolloClient = useApollo(pageProps.initialApolloState);

    return (
        <UserProvider>
        <ApolloProvider client={apolloClient}>
            <Component {... pageProps}/>
        </ApolloProvider>
        </UserProvider>
    )
}