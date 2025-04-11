import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

type PinterestItem = {
    id: string | number;
    color?: string;
    height?: number;
    [key: string]: any; // Allow additional properties
};

type PinterestLayoutProps = {
    data: PinterestItem[];
    numColumns?: number;
    itemSpacing?: number;
    renderItem: ({ item, index }: { item: PinterestItem; index: number }) => JSX.Element;
};

const PinterestLayout: React.FC<PinterestLayoutProps> = ({
    data,
    numColumns = 2,
    itemSpacing = 10,
    renderItem,
}) => {
    const columnWidth = (screenWidth - itemSpacing * (numColumns + 1)) / numColumns;

    const splitDataIntoColumns = (data: PinterestItem[], numColumns: number) => {
        const columns: PinterestItem[][] = Array.from({ length: numColumns }, () => []);
        data.forEach((item, index) => {
            columns[index % numColumns].push(item);
        });
        return columns;
    };

    const columns = splitDataIntoColumns(data, numColumns);

    return (
        <View style={[styles.container, { padding: itemSpacing }]}>
            <View style={styles.row}>
                {columns.map((column, columnIndex) => (
                    <View key={columnIndex} style={[styles.column, { width: columnWidth }]}>
                        {column.map((item, index) => (
                            <View
                                key={item.id}
                                style={{ marginBottom: 3 }}
                            >
                                {renderItem({ item, index })}
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
    },
});

export default PinterestLayout;
