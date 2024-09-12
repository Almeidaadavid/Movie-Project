import React, { useState } from 'react';
import { Button, Tooltip, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ShareFavoritesToken } from '../services/shareFavorite';
import { toast } from 'react-toastify';

const ShareFavoritesButton: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleGenerateShareLink = async () => {
        setLoading(true);
        try {
            const response = await ShareFavoritesToken();
            if (!response.success) {
                throw new Error('Erro ao compartilhar favoritos.');
            }
            
            const shareLink = `${window.location.origin}/shared-favorites/${response.token}`;
            localStorage.setItem('favoriteShareToken', JSON.stringify({
                token: response.token,
                expirationDate: response.expirationDate
            }));

            setShareLink(shareLink);
        } catch (error) {
            toast.error('Erro ao compartilhar favoritos.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink)
            .then(() => alert('Link copiado para a área de transferência!'))
            .catch((erro) => console.error('Erro ao copiar o link: ', erro));
    };

    return (
        <>
            <Tooltip title="Compartilhar favoritos">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    Compartilhar
                </Button>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Compartilhar Favoritos</DialogTitle>
                <DialogContent>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleGenerateShareLink}
                        disabled={loading}
                    >
                        {loading ? 'Gerando...' : 'Gerar Link de Compartilhamento'}
                    </Button>
                    {shareLink && (
                        <TextField
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            label="Link de Compartilhamento"
                            value={shareLink}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Fechar
                    </Button>
                    {shareLink && (
                        <Button
                            onClick={handleCopyLink}
                            color="primary"
                            startIcon={<ContentCopyIcon />}
                        >
                            Copiar Link
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ShareFavoritesButton;
