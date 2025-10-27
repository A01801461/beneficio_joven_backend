//----------------------------------------------------------
// /utils/emailService.js
//
// Servicio de email para recuperacion de password.
//
// Usando @sendgrid/mail para enviar correos.
// Sendgrid es una plataforma de envío de correos transaccionales y de marketing.
// esta configurado mi correo personal para pruebas.
//
// Fecha: 26-Oct-2025
// Autores: Equipo 2 - Gpo 401
//----------------------------------------------------------

const sgMail = require('@sendgrid/mail');

// Le decimos a la librería de SendGrid cuál es nuestra clave API.
// Esto solo se hace una vez en tu aplicación.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Función para enviar el correo de recuperación de contraseña usando @sendgrid/mail.
 * @param {string} toEmail - El correo del destinatario.
 * @param {string} token - El token de recuperación.
 */
exports.sendPasswordResetEmail = async (toEmail, token) => {
    // Definimos el contenido del correo en un formato que SendGrid entiende
    const msg = {
        to: toEmail,
        from: 'tu-email-verificado@tudominio.com', // ¡IMPORTANTE: Usa el email que verificaste en SendGrid!
        subject: 'Recuperación de Contraseña',
        // Cuerpo del correo en texto plano
        text: `Hola,\n\nHas solicitado restablecer tu contraseña de Beneficio Joven.\nTu código de recuperación es: ${token}\n\nEste código expira en 1 hora.\n\nSi no solicitaste esto, por favor ignora este correo.\n`,
        // Cuerpo del correo en HTML (el mismo que ya tenías)
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Recuperación de Contraseña</h2>
                <p>Hola,</p>
                <p>Has solicitado restablecer tu contraseña de Beneficio Joven. Usa el siguiente código para completar el proceso:</p>
                <div style="background-color: #f4f4f4; border-radius: 5px; padding: 10px 20px; text-align: center;">
                    <h3 style="font-size: 24px; letter-spacing: 2px; margin: 0;">${token}</h3>
                </div>
                <p>Este código es válido por <strong>1 hora</strong>.</p>
                <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
                <hr>
                <p>Saludos,<br>El equipo de Beneficio Joven</p>
            </div>
        `
    };

    try {
        // Usamos la librería para enviar el correo
        await sgMail.send(msg);
        console.log(`Correo de recuperación enviado exitosamente a ${toEmail}`);
    } catch (error) {
        console.error('Error al enviar el correo con SendGrid:', error);
        
        // El objeto de error de SendGrid es muy detallado, es útil registrarlo
        if (error.response) {
            console.error(error.response.body);
        }

        throw new Error('No se pudo enviar el correo de recuperación.');
    }
};