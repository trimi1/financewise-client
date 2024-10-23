import React from 'react';

function Goals() {
    return <section>
        <div className="is-flex flex-direction-row is-justify-content-end"> 
            <h2 className="text-end marginR5">Mode édition</h2>
            <img></img>
        </div>
        <table className="margin-5">
                    <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Objectif financier</th>
                        <th>Date limite</th>
                        <th>Devise</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Voiture</td>
                        <td>16570</td>
                        <td>01/01/2025</td>
                        <td>€</td>
                    </tr>
                    <tr>
                        <td>Maison</td>
                        <td>250 000</td>
                        <td>01/01/2030</td>
                        <td>€</td>
                    </tr>
                    <tr>
                        <td>Mariage</td>
                        <td>1000</td>
                        <td>01/01/2025</td>
                        <td>€</td>
                    </tr>
                    <tr>
                        <td>Appartement</td>
                        <td>20 000</td>
                        <td>01/01/2025</td>
                        <td>€</td>
                    </tr>
                    </tbody>
            </table>
    </section>
}

export default Goals