import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: '#F5F1E8',
    borderTopWidth: 3,
    borderTopColor: '#18181B',
  },
  navItem: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: '#FBBF24',
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  navItemCenter: {
    padding: 12,
  },
});

